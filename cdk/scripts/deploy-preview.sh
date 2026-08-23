#!/usr/bin/env bash
# Deploys the CDK stack WITHOUT a custom domain, so it's reachable only via
# the load balancer's own auto-generated DNS name. Use this to validate a
# change before cutting real traffic over — see deploy-live.sh for that.
set -euo pipefail

cd "$(dirname "$0")/.."

export AWS_PROFILE="${AWS_PROFILE:-cnb-next-copilot}"
export AWS_REGION="${AWS_REGION:-ap-southeast-2}"

# Make sure no domain vars leak in from the calling shell.
unset DOMAIN_NAME HOSTED_ZONE_ID HOSTED_ZONE_NAME

echo "Fetching build-time DynamoDB credentials from SSM..."
export DYNAMO_DB_ACCESS_KEY=$(aws ssm get-parameter --name "/cnb-next/prod/DYNAMO_DB_ACCESS_KEY" --with-decryption --query "Parameter.Value" --output text)
export DYNAMO_DB_ACCESS_KEY_SECRET=$(aws ssm get-parameter --name "/cnb-next/prod/DYNAMO_DB_ACCESS_KEY_SECRET" --with-decryption --query "Parameter.Value" --output text)

echo "Deploying preview (no custom domain)..."
npx cdk deploy "$@"
