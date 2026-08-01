#!/bin/bash -eu
# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the script's directory
cd "$SCRIPT_DIR" || exit
cd ..

# Fetch secrets once so they can be used for both the build (needed by
# getStaticProps pages that hit DynamoDB at build time) and the runtime
# container (needed by the API routes). In the real Copilot deployment these
# are injected into the running task directly - this script has to do that
# step itself for local docker runs.
DYNAMO_DB_ACCESS_KEY=$(AWS_PROFILE=cnb-next-copilot aws ssm get-parameter --name "/copilot/cnb-next/test/secrets/DYNAMO_DB_ACCESS_KEY" --with-decryption --query "Parameter.Value" --output text)
DYNAMO_DB_ACCESS_KEY_SECRET=$(AWS_PROFILE=cnb-next-copilot aws ssm get-parameter --name "/copilot/cnb-next/test/secrets/DYNAMO_DB_ACCESS_KEY_SECRET" --with-decryption --query "Parameter.Value" --output text)
OPEN_AI_API_KEY=$(AWS_PROFILE=cnb-next-copilot aws ssm get-parameter --name "/copilot/cnb-next/test/secrets/OPEN_AI_API_KEY" --with-decryption --query "Parameter.Value" --output text)

docker build -t cnb-nextjs-docker . \
 --progress=plain \
 --build-arg DYNAMO_DB_ACCESS_KEY="$DYNAMO_DB_ACCESS_KEY" \
 --build-arg DYNAMO_DB_ACCESS_KEY_SECRET="$DYNAMO_DB_ACCESS_KEY_SECRET" \
 --build-arg OPEN_AI_API_KEY="$OPEN_AI_API_KEY"

docker run -p 3000:3000 \
 -e DYNAMO_DB_ACCESS_KEY="$DYNAMO_DB_ACCESS_KEY" \
 -e DYNAMO_DB_ACCESS_KEY_SECRET="$DYNAMO_DB_ACCESS_KEY_SECRET" \
 -e OPEN_AI_API_KEY="$OPEN_AI_API_KEY" \
 cnb-nextjs-docker