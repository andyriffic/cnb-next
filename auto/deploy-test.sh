DYNAMO_DB_ACCESS_KEY=$(AWS_PROFILE=cnb-next-copilot aws ssm get-parameter --name "/copilot/cnb-next/test/secrets/DYNAMO_DB_ACCESS_KEY" --with-decryption --query "Parameter.Value" --output text) \
DYNAMO_DB_ACCESS_KEY_SECRET=$(AWS_PROFILE=cnb-next-copilot aws ssm get-parameter --name "/copilot/cnb-next/test/secrets/DYNAMO_DB_ACCESS_KEY_SECRET" --with-decryption --query "Parameter.Value" --output text) \
AWS_PROFILE=cnb-next-copilot \
 copilot svc deploy -n web -e test