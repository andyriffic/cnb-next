#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CnbNextStack } from "../lib/cnb-next-stack";

const app = new cdk.App();

new CnbNextStack(app, "CnbNextTestStack", {
  env: {
    account: "766741520701",
    region: "ap-southeast-2",
  },
  environmentName: "test",
  domainName: "cnb.finx-rocks.com",
  hostedZoneId: "Z3H2KCS6G4PEXD",
  hostedZoneName: "finx-rocks.com",
  secretsParameterPrefix: "/copilot/cnb-next/test/secrets",
});
