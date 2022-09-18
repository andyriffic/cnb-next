import { createServer } from "@graphql-yoga/node";
import { getAllPlayers, getPlayer } from "../../utils/data/aws-dynamodb";

const typeDefs = /* GraphQL */ `
  type Query {
    players: [Player!]!
    player(playerId: String!): Player
  }
  type Player {
    id: String!
    name: String!
  }
`;

const resolvers = {
  Query: {
    players: getAllPlayers,
    player: (parent: unknown, args: { playerId: string }) =>
      getPlayer(args.playerId),
  },
};

const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
  endpoint: "/api/graphql",
  // graphiql: false // uncomment to disable GraphiQL
});

export default server;
