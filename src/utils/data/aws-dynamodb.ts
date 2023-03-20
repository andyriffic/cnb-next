import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
  ScanCommand,
  ScanCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { AWS_REGION } from "../../constants";
import {
  DB_TABLE_NAME_PLAYERS,
  DYNAMO_DB_ACCESS_KEY,
  DYNAMO_DB_ACCESS_KEY_SECRET,
  ENVIRONMENT_NAME,
} from "../../environment";
import { Player, PlayerDetails } from "../../types/Player";

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
    ProjectionExpression: "id, #n, tags, details",
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

export const updatePlayer = (
  playerId: string,
  details: PlayerDetails
): Promise<void> => {
  const params: UpdateItemCommandInput = {
    TableName: DB_TABLE_NAME_PLAYERS,
    Key: {
      id: { S: playerId },
    },
    UpdateExpression: "set #d = :d",
    ExpressionAttributeNames: { ["#d"]: "details" },
    ExpressionAttributeValues: {
      [":d"]: { M: marshall(details) },
    },
  };

  return new Promise((resolve, reject) => {
    ddbClient
      .send(new UpdateItemCommand(params))
      .then(() => resolve())
      .catch((reason) => {
        console.error("DYNAMODB ERROR", reason);
        reject(reason);
      });
  });
};

export const updatePlayerLegacyTags = (
  playerId: string,
  tags: string[]
): Promise<void> => {
  const params: UpdateItemCommandInput = {
    TableName: DB_TABLE_NAME_PLAYERS,
    Key: {
      id: { S: playerId },
    },
    UpdateExpression: "set #t = :t",
    ExpressionAttributeNames: { ["#t"]: "tags" },
    ExpressionAttributeValues: {
      [":t"]: { SS: tags },
    },
  };

  return new Promise((resolve, reject) => {
    ddbClient
      .send(new UpdateItemCommand(params))
      .then(() => resolve())
      .catch((reason) => {
        console.error("DYNAMODB ERROR", reason);
        reject(reason);
      });
  });
};
