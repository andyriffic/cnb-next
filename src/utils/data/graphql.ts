import { gql, createClient } from "@urql/core";
import { Player } from "../../types/Player";

const client = createClient({
  url: "http://cnb.finx-rocks.com/api/graphql",
});

const QUERY = gql`
  query {
    players {
      id
      name
    }
  }
`;

const mockPlayers: Player[] = [
  { id: "andy", name: "Andy" },
  { id: "hugh", name: "Hugh" },
  { id: "byron", name: "Byron" },
];

export async function getCnbPlayers(): Promise<Player[]> {
  return Promise.resolve(mockPlayers);
  //   const result_1 = await client.query(QUERY, {}).toPromise();
  //   return result_1.data as Player[];
}

export async function getCnbPlayer(playerId: string): Promise<Player> {
  return Promise.resolve(mockPlayers.find((p) => p.id === playerId)!);
}
