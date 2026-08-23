import {
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { DB_TABLE_NAME_SETTINGS } from "../../environment";
import { SettingsCategory } from "../../types/Settings";
import { ddbClient } from "./dynamodb-client";

export const updateSetting = (
  settingsCategory: SettingsCategory,
): Promise<void> => {
  const params: PutItemInput = {
    TableName: DB_TABLE_NAME_SETTINGS,
    Item: marshall({
      category: settingsCategory.category,
      value: settingsCategory.settings,
    }),
  };

  return ddbClient
    .send(new PutItemCommand(params))
    .then(() => undefined)
    .catch((err) => console.log("dynamodb error", err));
};

export function getSetting<T>(category: string): Promise<T | undefined | void> {
  const params: GetItemCommandInput = {
    TableName: DB_TABLE_NAME_SETTINGS,
    Key: {
      category: { S: category },
    },
  };

  return ddbClient
    .send(new GetItemCommand(params))
    .then((data) => {
      return !data.Item ? undefined : (unmarshall(data.Item) as T);
    })
    .catch((err) => console.log("dynamodb error", err));
}
