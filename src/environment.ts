//Sett .env files for some definitions

//public
export const GRAPHQL_ENDPOINT: string =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "";

export const DB_TABLE_NAME_PLAYERS: string =
  process.env.DB_TABLE_NAME_PLAYERS || "";

//private
export const DYNAMO_DB_ACCESS_KEY = process.env.DYNAMO_DB_ACCESS_KEY || "";
export const DYNAMO_DB_ACCESS_KEY_SECRET =
  process.env.DYNAMO_DB_ACCESS_KEY_SECRET || "";
