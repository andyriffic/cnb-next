import { Player } from "../../../types/Player";

export type RPSCreateGameProps = { id: string; playerIds: [string, string] };

export type RPSGame = {
  id: string;
  playerIds: [string, string];
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

export type RPSSpectatorRoundView = {
  number: number;
  movedPlayerIds: string[];
  result?: {
    moves: RPSPlayerMove[];
  } & RPSRoundResult;
};

export type RPSSpectatorGameView = {
  id: string;
  playerIds: [string, string];
  rounds: RPSSpectatorRoundView[];
};
