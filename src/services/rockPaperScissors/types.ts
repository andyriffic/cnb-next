import { Player } from "../../types/Player";

export type RPSCreateGameProps = { playerIds: [string, string] };
export type RPSGame = {
  playerIds: string[];
  rounds: RPSRound[];
};
export type RPSRound = {
  index: number;
  moves: RPSPlayerMove[];
};
export type RPSPlayerMove = {
  playerId: string;
  moveName: RPSMoveName;
};
export type RPSMoveName = "rock" | "paper" | "scissors";
export type RPSPlayer = {} & Player;
