export type NumberCrunchGame = {
  id: string;
  mainPlayer: NumberCrunchMainPlayer;
  rounds: NumberCrunchRound[];
};

type NumberCrunchRoundRange = {
  low: number;
  high: number;
};

export type NumberCrunchRound = {
  range: NumberCrunchRoundRange;
  margin: number;
  guessingPlayers: NumberCrunchGuessingPlayer[];
};

export type NumberCrunchMainPlayer = {
  id: string;
  targetNumber?: number;
};

export type NumberCrunchGuessingPlayer = {
  id: string;
  guess?: number;
};
