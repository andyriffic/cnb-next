import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AWS_REGION } from "../../constants";
import {
  DB_TABLE_NAME_PLAYERS,
  DYNAMO_DB_ACCESS_KEY,
  DYNAMO_DB_ACCESS_KEY_SECRET,
  ENVIRONMENT_NAME,
} from "../../environment";
import { Player } from "../../types/Player";

const ddbClient = new DynamoDBClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: DYNAMO_DB_ACCESS_KEY,
    secretAccessKey: DYNAMO_DB_ACCESS_KEY_SECRET,
  },
});

export const getAllPlayers = (): Promise<Player[] | void> => {
  // console.log("BUILDING FROM ENV:", ENVIRONMENT_NAME);

  const params: ScanCommandInput = {
    // FilterExpression: "",
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    //  ExpressionAttributeValues: { ["#n"]: { S: "name" } },
    ExpressionAttributeNames: { ["#n"]: "name" },
    // Set the projection expression, which the the attributes that you want.
    ProjectionExpression: "id, #n, tags",
    TableName: DB_TABLE_NAME_PLAYERS,
  };
  return ddbClient
    .send(new ScanCommand(params))
    .then((data) => {
      return data.Items?.map((i) => unmarshall(i) as Player);
    })
    .catch((err) => console.log("dynamodb error", err));
};

export const getPlayer = (
  playerId: string
): Promise<Player | undefined | void> => {
  const params: GetItemCommandInput = {
    TableName: DB_TABLE_NAME_PLAYERS,
    Key: {
      id: { S: playerId },
    },
  };

  return ddbClient
    .send(new GetItemCommand(params))
    .then((data) => {
      return !data.Item ? undefined : (unmarshall(data.Item) as Player);
    })
    .catch((err) => console.log("dynamodb error", err));
};
