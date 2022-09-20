import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import {
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { AWS_REGION } from "../../constants";
import {
  DB_TABLE_NAME_PLAYERS,
  DYNAMO_DB_ACCESS_KEY,
  DYNAMO_DB_ACCESS_KEY_SECRET,
} from "../../environment";
import { Player } from "../../types/Player";

const ddbClient = new DynamoDBClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: DYNAMO_DB_ACCESS_KEY,
    secretAccessKey: DYNAMO_DB_ACCESS_KEY_SECRET,
  },
});

const allPlayers: Player[] = [
  { id: "p1", name: "player1" },
  { id: "p2", name: "player2" },
];

export const getAllPlayers = (): Promise<Player[]> => {
  //TODO: actually call aws
  return Promise.resolve(allPlayers);
};

type OutputType = {
  Item: Player | void;
} & GetItemCommandOutput;

export const getPlayer = (
  playerId: string
): Promise<Player | undefined | void> => {
  //TODO: actually call aws

  const params: GetItemCommandInput = {
    TableName: DB_TABLE_NAME_PLAYERS,
    Key: {
      id: { S: playerId },
    },
  };

  console.log("finding", params);

  return ddbClient
    .send(new GetItemCommand(params))
    .then((data) => {
      console.log("Got dynamo response", data);

      return !data.Item ? undefined : (unmarshall(data.Item) as Player);
    })
    .catch((err) => console.log("dynamodb error", err));

  // return Promise.resolve(allPlayers.find((p) => p.id === playerId)!);
};
