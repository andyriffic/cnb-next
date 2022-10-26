import { Player } from "../../../types/Player";

export type RPSCreateGameProps = { id: string; playerIds: [string, string] };

export type RPSGame = {
  playerIds: string[];
  rounds: RPSRound[];
};

export type RPSRound = {
  index: number;
  moves: RPSPlayerMove[];
  result?: RPSRoundResult;
};

export type RPSRoundResult = {
  draw: boolean;
  winningPlayerId?: string;
};

export type RPSPlayerMove = {
  playerId: string;
  moveName: RPSMoveName;
};

export type RPSMoveName = "rock" | "paper" | "scissors";
export type RPSPlayer = {} & Player;
