#!/bin/bash -eu
# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the script's directory
cd "$SCRIPT_DIR" || exit
cd ..

# Builds and runs the container against DEV DynamoDB/OpenAI, using the
# settings already sitting in .env.local. No AWS SSM calls or AWS profile
# needed here - the app reads DYNAMO_DB_ACCESS_KEY/SECRET straight out of
# process.env as explicit SDK credentials (see src/environment.ts and
# src/utils/data/aws-dynamodb-players.ts), and .env.local already has the
# dev key pair alongside the dev table names/endpoints.

# /play and /player/profile/[id] call DynamoDB during `next build` itself
# (getStaticProps). Turn every .env.local entry into an explicit
# --build-arg (the Dockerfile applies each one as a real env var for that
# build step) so those pages are generated against dev data too, without
# ever touching the git-tracked .env.production file.
BUILD_ARGS=()
while IFS='=' read -r key value || [ -n "$key" ]; do
  [ -z "$key" ] && continue
  case "$key" in \#*) continue ;; esac
  BUILD_ARGS+=(--build-arg "$key=$value")
done < .env.local

docker build -t cnb-nextjs-docker-dev . \
 --progress=plain \
 "${BUILD_ARGS[@]}"

docker run -p 3000:3000 --env-file .env.local cnb-nextjs-docker-dev
