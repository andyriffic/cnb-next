#!/usr/bin/env bash
# Deploys the CDK stack WITH the real custom domain attached — this points
# cnb.finx-rocks.com at the CDK-managed load balancer (adds an ACM cert and
# an HTTPS listener, redirecting HTTP -> HTTPS). Only run this after you've
# validated the change with deploy-preview.sh against the ALB's own DNS name.
set -euo pipefail

cd "$(dirname "$0")/.."

export AWS_PROFILE="${AWS_PROFILE:-cnb-next-copilot}"
export AWS_REGION="${AWS_REGION:-ap-southeast-2}"

export DOMAIN_NAME="cnb.finx-rocks.com"
export HOSTED_ZONE_NAME="finx-rocks.com"
export HOSTED_ZONE_ID="Z3H2KCS6G4PEXD"

echo "This will point ${DOMAIN_NAME} at the CDK-managed load balancer."
read -r -p "Continue? [y/N] " confirm
case "$confirm" in
  [yY]|[yY][eE][sS]) ;;
  *) echo "Aborted."; exit 1 ;;
esac

echo "Fetching build-time DynamoDB credentials from SSM..."
export DYNAMO_DB_ACCESS_KEY=$(aws ssm get-parameter --name "/cnb-next/prod/DYNAMO_DB_ACCESS_KEY" --with-decryption --query "Parameter.Value" --output text)
export DYNAMO_DB_ACCESS_KEY_SECRET=$(aws ssm get-parameter --name "/cnb-next/prod/DYNAMO_DB_ACCESS_KEY_SECRET" --with-decryption --query "Parameter.Value" --output text)

echo "Deploying live (domain: ${DOMAIN_NAME})..."
npx cdk deploy "$@"
