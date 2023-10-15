import { Player } from "../../types/Player";

export type RPSCreateGameProps = {
  id: string;
  playerIds: [string, string];
  spectatorTargetGuesses: number;
};

export type RPSGame = {
  id: string;
  playerIds: [string, string];
  currentRound: RPSRound;
  roundHistory: RPSRound[];
  spectatorTargetGuesses: number;
};

export type RPSRound = {
  moves: RPSPlayerMove[];
  result?: RPSRoundResult;
  bonusPoints: number;
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
  movedPlayerIds: string[];
  result?: {
    moves: RPSPlayerMove[];
  } & RPSRoundResult;
};

export type RPSSpectatorGameView = {
  id: string;
  currentRound: RPSSpectatorRoundView;
  playerIds: [string, string];
  roundHistory: RPSSpectatorRoundView[];
  scores: { playerId: string; score: number }[];
  spectatorTargetGuesses: number;
};
