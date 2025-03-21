#!/bin/bash -eu

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the script's directory
cd "$SCRIPT_DIR" || exit
cd ..

# exit when any command fails
set -e

npm run typecheck

DYNAMO_DB_ACCESS_KEY=$(AWS_PROFILE=cnb-next-copilot aws ssm get-parameter --name "/copilot/cnb-next/test/secrets/DYNAMO_DB_ACCESS_KEY" --with-decryption --query "Parameter.Value" --output text) \
DYNAMO_DB_ACCESS_KEY_SECRET=$(AWS_PROFILE=cnb-next-copilot aws ssm get-parameter --name "/copilot/cnb-next/test/secrets/DYNAMO_DB_ACCESS_KEY_SECRET" --with-decryption --query "Parameter.Value" --output text) \
OPEN_AI_API_KEY=$(AWS_PROFILE=cnb-next-copilot aws ssm get-parameter --name "/copilot/cnb-next/test/secrets/OPEN_AI_API_KEY" --with-decryption --query "Parameter.Value" --output text) \
AWS_PROFILE=cnb-next-copilot \
 copilot svc deploy -n web -e test