import * as path from "path";
import * as fs from "fs";
import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import * as ecrAssets from "aws-cdk-lib/aws-ecr-assets";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

const REPO_ROOT = path.join(__dirname, "..", "..");

// Same three secrets Copilot injected as build args (for getStaticProps
// DynamoDB calls at build time) and as runtime task secrets. Supplied by
// the deploy script via process.env, same as auto/deploy-test.sh always did.
const SECRET_BUILD_ARG_KEYS = [
  "DYNAMO_DB_ACCESS_KEY",
  "DYNAMO_DB_ACCESS_KEY_SECRET",
  "OPEN_AI_API_KEY",
] as const;

function readEnvProductionBuildArgs(): Record<string, string> {
  const envProductionPath = path.join(REPO_ROOT, ".env.production");
  const contents = fs.readFileSync(envProductionPath, "utf-8");
  const buildArgs: Record<string, string> = {};

  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!key) continue;
    buildArgs[key] = rest.join("=");
  }

  return buildArgs;
}

function readSecretBuildArgs(): Record<string, string> {
  const buildArgs: Record<string, string> = {};

  for (const key of SECRET_BUILD_ARG_KEYS) {
    const value = process.env[key];
    if (!value) {
      throw new Error(
        `Missing required env var ${key} - export it before running cdk deploy (see auto/deploy-test.sh)`
      );
    }
    buildArgs[key] = value;
  }

  return buildArgs;
}

export interface CnbNextStackProps extends StackProps {
  /** e.g. "test" - matches the copilot/environments/<name> the stack replaces. */
  environmentName: string;
  /** Public domain the ALB should serve, e.g. "cnb.finx-rocks.com". */
  domainName: string;
  /** Route53 hosted zone that owns domainName. */
  hostedZoneId: string;
  hostedZoneName: string;
  /** SSM parameter path prefix holding the runtime secrets, e.g. "/copilot/cnb-next/test/secrets". */
  secretsParameterPrefix: string;
}

export class CnbNextStack extends Stack {
  constructor(scope: Construct, id: string, props: CnbNextStackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: "public",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
      ],
    });

    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc,
      clusterName: `cnb-next-${props.environmentName}`,
    });

    const image = new ecrAssets.DockerImageAsset(this, "Image", {
      directory: REPO_ROOT,
      file: "Dockerfile",
      // .dockerignore (used by plain `docker build`) doesn't exclude .git or
      // infra/ - CDK's asset staging needs both excluded too, otherwise it
      // recursively copies infra/cdk.out into itself while staging.
      exclude: [".git", "infra"],
      buildArgs: {
        ...readEnvProductionBuildArgs(),
        ...readSecretBuildArgs(),
      },
    });

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.hostedZoneName,
    });

    const runtimeSecrets: Record<string, ecs.Secret> = {};
    for (const key of SECRET_BUILD_ARG_KEYS) {
      runtimeSecrets[key] = ecs.Secret.fromSsmParameter(
        ssm.StringParameter.fromSecureStringParameterAttributes(this, `${key}Param`, {
          parameterName: `${props.secretsParameterPrefix}/${key}`,
        })
      );
    }

    const service = new ecsPatterns.ApplicationLoadBalancedFargateService(this, "Service", {
      cluster,
      serviceName: "web",
      cpu: 256,
      memoryLimitMiB: 512,
      desiredCount: 1,
      assignPublicIp: true,
      publicLoadBalancer: true,
      enableExecuteCommand: true,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      domainName: props.domainName,
      domainZone: hostedZone,
      redirectHTTP: true,
      taskImageOptions: {
        image: ecs.ContainerImage.fromDockerImageAsset(image),
        containerPort: 3000,
        secrets: runtimeSecrets,
        logDriver: ecs.LogDrivers.awsLogs({
          streamPrefix: "web",
          logRetention: logs.RetentionDays.ONE_MONTH,
        }),
      },
    });

    service.targetGroup.configureHealthCheck({
      path: "/",
    });

    new CfnOutput(this, "LoadBalancerDnsName", {
      value: service.loadBalancer.loadBalancerDnsName,
    });
    new CfnOutput(this, "ClusterName", {
      value: cluster.clusterName,
    });
    new CfnOutput(this, "ServiceName", {
      value: service.service.serviceName,
    });
  }
}
