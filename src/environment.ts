//Sett .env files for some definitions

//public
export const GRAPHQL_ENDPOINT: string =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "";
export const SOCKET_ENDPOINT: string =
  process.env.NEXT_PUBLIC_SOCKET_ENDPOINT || "";

export const DB_TABLE_NAME_PLAYERS: string =
  process.env.DB_TABLE_NAME_PLAYERS || "";

export const ENVIRONMENT_NAME: string = process.env.ENVIRONMENT_NAME || "";

//private
export const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY || "";
export const DYNAMO_DB_ACCESS_KEY = process.env.DYNAMO_DB_ACCESS_KEY || "";
export const DYNAMO_DB_ACCESS_KEY_SECRET =
  process.env.DYNAMO_DB_ACCESS_KEY_SECRET || "";
