#!/bin/bash -eu

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the script's directory
cd "$SCRIPT_DIR" || exit
cd ..

AWS_PROFILE=cnb-next-copilot bash -c 'cd infra && npx cdk destroy --force'