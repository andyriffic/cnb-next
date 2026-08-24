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

Requires Node >= 26, matching the Dockerfile's `node:26.5-alpine` base image
(aws-cdk-lib's own minimum is >=20, but this repo standardizes on 26).

```
cd cdk
npm install
```

Then use one of the two scripts in `scripts/`, both of which pull the
DynamoDB build-time credentials from SSM for you:

- **`scripts/deploy-preview.sh`** — deploys without a custom domain, so you
  validate against the load balancer's own auto-generated DNS name (printed
  as the `LoadBalancerDnsName` stack output). Use this for every change
  before cutting real traffic over.
- **`scripts/deploy-live.sh`** — deploys **with** `cnb.finx-rocks.com`
  attached (ACM cert + HTTPS listener, HTTP redirects to HTTPS). Prompts for
  confirmation before running, since this is the real DNS cutover. Only run
  this after validating with `deploy-preview.sh` first.

Both assume the `cnb-next-copilot` AWS profile; override with
`AWS_PROFILE=... ./scripts/deploy-preview.sh` if needed. They also accept
any extra `cdk deploy` flags, e.g. `./scripts/deploy-preview.sh --require-approval never`.

Alternatively trigger the `deploy-prod-cdk` GitHub Actions workflow manually
(`workflow_dispatch`), which follows the same SSM-fetch pattern as
`deploy-test.yml` does today, but always deploys without a custom domain.

## Cutting over from Copilot

Once validated against the ALB's own DNS name (`scripts/deploy-preview.sh`):

1. Run `scripts/deploy-live.sh` — this adds an ACM certificate and points
   the real domain at the CDK-managed load balancer.
2. Confirm traffic is flowing correctly on the real domain.
3. Remove the Copilot service/environment/app (`copilot svc delete`,
   `copilot env delete`, `copilot app delete`) and delete the `copilot/`
   directory and the `deploy-test`/`destroy-test` workflows.

## Tearing down

`scripts/destroy.sh` runs `cdk destroy` on the stack (VPC, ECS
service/cluster, load balancer, and — if attached — the ACM cert), after a
confirmation prompt. It deletes by stack name, so it works the same way
regardless of whether the stack was last deployed via `deploy-preview.sh` or
`deploy-live.sh`. The imported DynamoDB tables are not part of the stack's
own resources and are never touched by this.

## Why the task role only covers runtime, not build

Two pages (`/play`, `/player/profile/[playerId]`) use `getStaticProps` and
read from DynamoDB at `next build` time, before any ECS task (and its role)
exists. The Docker build still needs explicit credentials for that step
(same as today), passed as build args. At container runtime, no credentials
are set in the environment, so the AWS SDK falls back to its default
provider chain and picks up the Fargate task role automatically.
