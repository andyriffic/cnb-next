import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemInput,
  ScanCommand,
  ScanCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import * as TE from "fp-ts/TaskEither";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { pipe } from "fp-ts/lib/function";
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

export const addPlayer = (id: string, name: string): Promise<void> => {
  const params: PutItemInput = {
    TableName: DB_TABLE_NAME_PLAYERS,
    Item: marshall({ id, name, tags: [], details: {} }),
  };

  return ddbClient
    .send(new PutItemCommand(params))
    .then(() => undefined)
    .catch((err) => console.log("dynamodb error", err));
};

export const getAllPlayersTE = (): TE.TaskEither<string, Player[]> => {
  return pipe(
    TE.tryCatch(
      () => getAllPlayers(),
      (error) => {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String(error);
        return message;
      }
    ),
    TE.chain((playersOrVoid) =>
      !playersOrVoid ? TE.left("No players found") : TE.right(playersOrVoid)
    )
  );
};

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
    ExpressionAttributeNames: { "#t": "tags" },
    ExpressionAttributeValues: {
      ":t": { L: tags.map((t) => ({ S: t })) },
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
