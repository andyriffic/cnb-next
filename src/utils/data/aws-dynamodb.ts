import { Player } from "../../types/Player";

const allPlayers: Player[] = [
  { id: "p1", name: "player1" },
  { id: "p2", name: "player2" },
];

export const getAllPlayers = (): Promise<Player[]> => {
  //TODO: actually call aws
  return Promise.resolve(allPlayers);
};

export const getPlayer = (playerId: string): Promise<Player> => {
  //TODO: actually call aws
  return Promise.resolve(allPlayers.find((p) => p.id === playerId)!);
};
