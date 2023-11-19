import { Player } from "../../types/Player";

export type GroupBettingGame = {
  id: string;
  currentRound: GroupPlayerBettingRound;
  roundHistory: GroupPlayerBettingRound[];
  playerWallets: PlayerWallet[];
};

export type GroupPlayerBettingRound = {
  bettingOptions: BettingOption[];
  playerBets: PlayerBet[];
  result?: GroupBettingRoundResult;
};

export type GroupBettingRoundResult = {
  winningOptionId: string;
  playerResults: PlayerBettingRoundResult[];
};

export type PlayerBettingRoundResult = {
  playerId: string;
  totalWinnings: number;
};

export type PlayerBet = {
  playerId: string;
  betValue: number;
  betOptionId: string;
};

export type BettingOption = {
  id: string;
  name: string;
  odds: number;
  betReturn: "oddsOnly" | "multiply";
};

export type PlayerWallet = {
  player: Player;
  value: number;
};
