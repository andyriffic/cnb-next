import React from "react";
import { createClient, Provider, Context, useQuery } from "urql";
import { GRAPHQL_ENDPOINT } from "../environmentVariables.dev";
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
