export type GroupBettingGame = {
  id: string;
  rounds: GroupPlayerBettingRound[];
  playerWallets: PlayerWallet[];
};

export type GroupPlayerBettingRound = {
  index: number;
  bettingOptions: BettingOption[];
  playerBets: PlayerBet[];
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
};

export type PlayerWallet = {
  playerId: string;
  value: number;
};
