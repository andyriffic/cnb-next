#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CnbNextStack } from "../lib/cnb-next-stack";

const app = new cdk.App();

// Not required for every CDK command (e.g. `cdk bootstrap`/`cdk list` still
// load this file but don't need a real Docker build), so warn rather than
// throw. `cdk deploy`/`cdk synth` will bake whatever value is present here
// into the built image, so set these for real before an actual deploy.
function buildTimeEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.warn(
      `Warning: ${name} is not set. The Docker build's static-generation ` +
        `step (getStaticProps on /play and /player/profile) will run without ` +
        `DynamoDB access. Set it before running "cdk deploy".`
    );
  }
  return value || "";
}

// Set DOMAIN_NAME/HOSTED_ZONE_ID/HOSTED_ZONE_NAME once you've validated the
// stack against its own load balancer DNS name and are ready to cut real
// traffic over from the Copilot-managed service.
const domainName = process.env.DOMAIN_NAME;
const hostedZoneId = process.env.HOSTED_ZONE_ID;
const hostedZoneName = process.env.HOSTED_ZONE_NAME;

new CnbNextStack(app, "CnbNextProdStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.AWS_REGION || "ap-southeast-2",
  },
  envName: "prod",
  playersTableName: "cnb-players-prod",
  settingsTableName: "cnb-settings-prod",
  openAiApiKeySsmParameterName: "/cnb-next/prod/OPEN_AI_API_KEY",
  dynamoDbBuildAccessKey: buildTimeEnv("DYNAMO_DB_ACCESS_KEY"),
  dynamoDbBuildAccessKeySecret: buildTimeEnv("DYNAMO_DB_ACCESS_KEY_SECRET"),
  domainName,
  hostedZoneId,
  hostedZoneName,
});
