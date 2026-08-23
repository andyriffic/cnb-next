import * as path from "path";
import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr_assets from "aws-cdk-lib/aws-ecr-assets";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";

export interface CnbNextStackProps extends cdk.StackProps {
  /** Logical environment name, e.g. "prod". Used for tagging/naming only. */
  envName: string;
  playersTableName: string;
  settingsTableName: string;
  /** SSM parameter (SecureString) holding the OpenAI API key, injected as a runtime secret. */
  openAiApiKeySsmParameterName: string;
  /**
   * Only needed at Docker build time: two of the app's pages use getStaticProps
   * to prerender player data from DynamoDB at build time, so the image build
   * needs read credentials. At runtime the task role is used instead (see
   * src/utils/data/dynamodb-client.ts).
   */
  dynamoDbBuildAccessKey: string;
  dynamoDbBuildAccessKeySecret: string;
  /**
   * Custom domain to attach to the load balancer. Leave undefined for the
   * first deploy so you can validate against the ALB's own DNS name before
   * cutting real traffic over from the existing Copilot-managed service.
   */
  domainName?: string;
  hostedZoneId?: string;
  hostedZoneName?: string;
}

export class CnbNextStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CnbNextStackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 2,
      natGateways: 1,
    });

    const cluster = new ecs.Cluster(this, "Cluster", { vpc });

    const image = new ecr_assets.DockerImageAsset(this, "AppImage", {
      directory: path.join(__dirname, "../../"),
      file: "Dockerfile",
      platform: ecr_assets.Platform.LINUX_AMD64,
      buildArgs: {
        DYNAMO_DB_ACCESS_KEY: props.dynamoDbBuildAccessKey,
        DYNAMO_DB_ACCESS_KEY_SECRET: props.dynamoDbBuildAccessKeySecret,
      },
    });

    const playersTable = dynamodb.Table.fromTableName(
      this,
      "PlayersTable",
      props.playersTableName
    );
    const settingsTable = dynamodb.Table.fromTableName(
      this,
      "SettingsTable",
      props.settingsTableName
    );

    const openAiApiKeyParam = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      "OpenAiApiKeyParam",
      { parameterName: props.openAiApiKeySsmParameterName }
    );

    let hostedZone: route53.IHostedZone | undefined;
    let certificate: acm.ICertificate | undefined;
    if (props.domainName && props.hostedZoneId && props.hostedZoneName) {
      hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, "Zone", {
        hostedZoneId: props.hostedZoneId,
        zoneName: props.hostedZoneName,
      });
      certificate = new acm.Certificate(this, "Certificate", {
        domainName: props.domainName,
        validation: acm.CertificateValidation.fromDns(hostedZone),
      });
    }

    const service = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      "Service",
      {
        cluster,
        cpu: 256,
        memoryLimitMiB: 512,
        desiredCount: 1,
        publicLoadBalancer: true,
        enableExecuteCommand: true,
        protocol: certificate
          ? elbv2.ApplicationProtocol.HTTPS
          : elbv2.ApplicationProtocol.HTTP,
        certificate,
        redirectHTTP: !!certificate,
        domainName: props.domainName,
        domainZone: hostedZone,
        taskImageOptions: {
          image: ecs.ContainerImage.fromDockerImageAsset(image),
          containerPort: 3000,
          environment: {
            ENVIRONMENT_NAME: props.envName,
            DB_TABLE_NAME_PLAYERS: props.playersTableName,
            DB_TABLE_NAME_SETTINGS: props.settingsTableName,
          },
          secrets: {
            OPEN_AI_API_KEY: ecs.Secret.fromSsmParameter(openAiApiKeyParam),
          },
        },
      }
    );

    service.targetGroup.configureHealthCheck({ path: "/" });

    playersTable.grantReadWriteData(service.taskDefinition.taskRole);
    settingsTable.grantReadWriteData(service.taskDefinition.taskRole);

    new cdk.CfnOutput(this, "LoadBalancerDnsName", {
      value: service.loadBalancer.loadBalancerDnsName,
      description:
        "Use this to validate the new deployment before cutting over DNS",
    });

    if (props.domainName) {
      new cdk.CfnOutput(this, "AppUrl", {
        value: `https://${props.domainName}`,
      });
    }
  }
}
