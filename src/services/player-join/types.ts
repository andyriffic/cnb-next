import { Player } from "../../types/Player";

export type PlayerGroup = {
  id: string;
  playerIds: string[];
  players: Player[];
};
