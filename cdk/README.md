# cnb-next CDK app

Replaces the AWS Copilot deployment (`copilot/`) for the `prod` environment.
Both mechanisms currently coexist — do not delete `copilot/` or the
`deploy-test`/`destroy-test` GitHub Actions workflows until the CDK-managed
service has been validated and DNS has been cut over.

## What this creates

- A new VPC (2 AZs, 1 NAT gateway) and ECS cluster — separate from whatever
  Copilot provisioned, so the two can run side by side.
- A Fargate service (256 CPU / 512 MB, 1 task) behind an Application Load
  Balancer, built from the repo's existing `Dockerfile`.
- A Fargate **task role** with read/write access to the existing
  `cnb-players-prod` and `cnb-settings-prod` DynamoDB tables (imported by
  name, not recreated). This replaces the static
  `DYNAMO_DB_ACCESS_KEY`/`DYNAMO_DB_ACCESS_KEY_SECRET` credentials used at
  container runtime today — see `src/utils/data/dynamodb-client.ts`.
- `OPEN_AI_API_KEY` injected as a real ECS runtime secret from an SSM
  SecureString parameter (not baked into the image).

## One-time setup before first deploy

1. `cdk bootstrap` the target account/region, if not already done.
2. Create the SSM parameter the stack reads at runtime (copy the value from
   the existing `/copilot/cnb-next/test/secrets/OPEN_AI_API_KEY` parameter):

   ```
   aws ssm put-parameter \
     --name /cnb-next/prod/OPEN_AI_API_KEY \
     --type SecureString \
     --value "<value>"
   ```

3. Also store the DynamoDB build-time credentials under the new `prod`
   naming (used only during `next build`'s static generation step, not at
   runtime — see below):

   ```
   aws ssm put-parameter --name /cnb-next/prod/DYNAMO_DB_ACCESS_KEY --type SecureString --value "<value>"
   aws ssm put-parameter --name /cnb-next/prod/DYNAMO_DB_ACCESS_KEY_SECRET --type SecureString --value "<value>"
   ```

## Deploy

Requires Node >= 20 (aws-cdk-lib's minimum) — separate from whatever Node
version you use for the Next.js app itself.

```
cd cdk
npm install
DYNAMO_DB_ACCESS_KEY=... DYNAMO_DB_ACCESS_KEY_SECRET=... npx cdk deploy
```

Or trigger the `deploy-prod-cdk` GitHub Actions workflow manually
(`workflow_dispatch`), which pulls those two values from SSM the same way
`deploy-test.yml` does today.

The stack outputs `LoadBalancerDnsName` — use it to validate the app end to
end (including the socket.io-based games) before touching DNS.

## Cutting over from Copilot

Once validated against the ALB's own DNS name:

1. Set `DOMAIN_NAME=cnb.finx-rocks.com`, `HOSTED_ZONE_ID=<zone id>`,
   `HOSTED_ZONE_NAME=finx-rocks.com` as env vars and redeploy — this adds an
   ACM certificate and points the real domain at the CDK-managed load
   balancer (HTTP will redirect to HTTPS).
2. Confirm traffic is flowing correctly on the real domain.
3. Remove the Copilot service/environment/app (`copilot svc delete`,
   `copilot env delete`, `copilot app delete`) and delete the `copilot/`
   directory and the `deploy-test`/`destroy-test` workflows.

## Why the task role only covers runtime, not build

Two pages (`/play`, `/player/profile/[playerId]`) use `getStaticProps` and
read from DynamoDB at `next build` time, before any ECS task (and its role)
exists. The Docker build still needs explicit credentials for that step
(same as today), passed as build args. At container runtime, no credentials
are set in the environment, so the AWS SDK falls back to its default
provider chain and picks up the Fargate task role automatically.
