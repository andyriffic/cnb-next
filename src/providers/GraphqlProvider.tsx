import React from "react";
import { createClient, Provider, Context, useQuery } from "urql";
import { GRAPHQL_ENDPOINT } from "../environment";
import { Player } from "../types/Player";

const client = createClient({
  url: GRAPHQL_ENDPOINT,
});

type Props = {
  children: React.ReactNode;
};

export const GraphqlProvider = ({ children }: Props): JSX.Element => {
  return <Provider value={client}>{children}</Provider>;
};

const getPlayerQuery = `
 query ($playerId: String!) {
    player (playerId: $playerId) {
      id
      name
    }
  }
`;

const getAllPlayersQuery = `
 query {
    players {
      id
      name
    }
  }
`;

export function useFetchPlayerQuery(playerId: string) {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error(
      "useFetchPlayerQuery must be used within a GraphqlProvider"
    );
  }

  const [result] = useQuery<{ player: Player } | null>({
    query: getPlayerQuery,
    variables: { playerId },
  });

  return result;
}

export function useFetchAllPlayersQuery() {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error(
      "useFetchAllPlayersQuery must be used within a GraphqlProvider"
    );
  }

  const [result] = useQuery<{ players: Player[] } | null>({
    query: getAllPlayersQuery,
  });

  return result;
}
