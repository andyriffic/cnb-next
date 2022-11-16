export type GroupBettingGame = {
  id: string;
  rounds: GroupPlayerBettingRound[];
  playerIds: string[];
};

export type GroupPlayerBettingRound = {
  bettingOptions: BettingOption[];
  playerBets: PlayerBet[];
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
};
