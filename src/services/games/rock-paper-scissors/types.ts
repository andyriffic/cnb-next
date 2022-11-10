import { Player } from "../../../types/Player";

export type RPSCreateGameProps = { id: string; playerIds: [string, string] };

export type RPSGame = {
  id: string;
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

export type RPSSpectatorGameView = {
  playerIds: [string, string];
  rounds: {
    number: number;
    movedPlayerIds: [string, string];
    status: "waiting" | "ready" | "resolved";
    result?: {
      moves: [RPSPlayerMove, RPSPlayerMove];
      draw: boolean;
      winningPlayerId?: string;
    };
  }[];
};
