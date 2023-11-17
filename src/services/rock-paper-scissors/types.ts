import { Player } from "../../types/Player";

export type RPSCreateGameProps = {
  id: string;
  players: [Player, Player];
  spectatorTargetGuesses: number;
};

export type RPSGame = {
  id: string;
  players: [Player, Player];
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
  bonusPoints: number;
  movedPlayerIds: string[];
  result?: {
    moves: RPSPlayerMove[];
  } & RPSRoundResult;
};

export type RPSSpectatorGameView = {
  id: string;
  currentRound: RPSSpectatorRoundView;
  players: [Player, Player];
  roundHistory: RPSSpectatorRoundView[];
  scores: { playerId: string; score: number }[];
  spectatorTargetGuesses: number;
};
