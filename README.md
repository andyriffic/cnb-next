This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deployment

The `test` environment runs on ECS Fargate behind an ALB, managed by an AWS CDK app in [`infra/`](infra/) (not Vercel). The stack builds and pushes the Docker image, and serves it at `cnb.finx-rocks.com`.

One-time setup, per AWS account/region:

```bash
cd infra
npm install
npx cdk bootstrap aws://766741520701/ap-southeast-2
```

Deploy/destroy the `test` environment:

```bash
auto/deploy-test.sh    # typechecks, pulls secrets from SSM, runs cdk deploy
auto/destroy-test.sh   # runs cdk destroy
```

See `infra/lib/cnb-next-stack.ts` for the stack definition (VPC, ECS cluster/service, ALB, ACM cert, Route53 alias).
