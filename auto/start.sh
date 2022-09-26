#!/bin/bash -eu
cd $(dirname $0)/..

#DYNAMO_DB_ACCESS_KEY=$(AWS_PROFILE=cnb-next-copilot aws ssm get-parameter --name "/copilot/cnb-next/test/secrets/DYNAMO_DB_ACCESS_KEY" --with-decryption --query "Parameter.Value" --output text) \
#DYNAMO_DB_ACCESS_KEY_SECRET=$(AWS_PROFILE=cnb-next-copilot aws ssm get-parameter --name "/copilot/cnb-next/test/secrets/DYNAMO_DB_ACCESS_KEY_SECRET" --with-decryption --query "Parameter.Value" --output text) \
docker build -t cnb-nextjs-docker . \
 --progress=plain \
 --build-arg DYNAMO_DB_ACCESS_KEY=$(AWS_PROFILE=cnb-next-copilot aws ssm get-parameter --name "/copilot/cnb-next/test/secrets/DYNAMO_DB_ACCESS_KEY" --with-decryption --query "Parameter.Value" --output text) \
 --build-arg DYNAMO_DB_ACCESS_KEY_SECRET=$(AWS_PROFILE=cnb-next-copilot aws ssm get-parameter --name "/copilot/cnb-next/test/secrets/DYNAMO_DB_ACCESS_KEY_SECRET" --with-decryption --query "Parameter.Value" --output text) \

docker run -p 3000:3000 cnb-nextjs-docker