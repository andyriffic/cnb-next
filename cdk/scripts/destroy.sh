#!/usr/bin/env bash
# Tears down the CDK-managed stack: VPC, ECS cluster/service, ALB, and their
# supporting resources (security groups, log group, ACM cert if the domain
# was attached). The DynamoDB tables (cnb-players-prod, cnb-settings-prod)
# are imported by name, not owned by this stack, so they are NOT deleted.
set -euo pipefail

cd "$(dirname "$0")/.."

export AWS_PROFILE="${AWS_PROFILE:-cnb-next-copilot}"
export AWS_REGION="${AWS_REGION:-ap-southeast-2}"

echo "This will destroy the CnbNextProdStack CDK stack (VPC, ECS service, load balancer)."
echo "DynamoDB tables are imported, not owned by this stack, and will NOT be affected."
read -r -p "Continue? [y/N] " confirm
case "$confirm" in
  [yY]|[yY][eE][sS]) ;;
  *) echo "Aborted."; exit 1 ;;
esac

npx cdk destroy "$@"
