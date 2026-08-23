import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AWS_REGION } from "../../constants";
import {
  DYNAMO_DB_ACCESS_KEY,
  DYNAMO_DB_ACCESS_KEY_SECRET,
} from "../../environment";

// Static keys are only present at build time (Next.js static generation) and
// in local dev. At runtime in ECS, no keys are set and the SDK falls back to
// its default credential provider chain, which picks up the Fargate task role.
export const ddbClient = new DynamoDBClient({
  region: AWS_REGION,
  ...(DYNAMO_DB_ACCESS_KEY && DYNAMO_DB_ACCESS_KEY_SECRET
    ? {
        credentials: {
          accessKeyId: DYNAMO_DB_ACCESS_KEY,
          secretAccessKey: DYNAMO_DB_ACCESS_KEY_SECRET,
        },
      }
    : {}),
});
