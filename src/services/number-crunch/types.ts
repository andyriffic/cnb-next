export type NumberCrunchGame = {
  id: string;
  target: number;
  rounds: NumberCrunchRound[];
  players: NumberCrunchPlayer[];
};

type NumberCrunchPlayer = {
  id: string;
  name: string;
};

type NumberCrunchRoundRange = {
  low: number;
  high: number;
};

export type NumberCrunchRound = {
  range: NumberCrunchRoundRange;
  playerGuesses: NumberCrunchPlayerGuess[];
};

export type NumberCrunchPlayerGuess = {
  id: string;
  guess: number;
  offBy: number;
};

export type NumberCrunchGuessResultRangeIndicator =
  | "exact"
  | "cold"
  | "warm"
  | "hot";

export type NumberCrunchPlayerGuessResult = {
  id: string;
  range: NumberCrunchGuessResultRangeIndicator;
};

export type NumberCrunchGameView = {
  id: string;
  roundNumber: number;
  players: NumberCrunchPlayerView[];
  previousRounds: NumberCrunchRoundView[];
  // allRounds: NumberCrunchRoundView[];
  currentRound: NumberCrunchRoundView;
};

type NumberCrunchPlayerView = NumberCrunchPlayer & {
  guessedThisRound: boolean;
};

export type NumberCrunchPlayerGuessView = {
  playerId: string;
  bucketRangeIndex: number;
};

export type NumberCrunchRoundView = {
  range: NumberCrunchRoundRange;
  allPlayersGuessed: boolean;
  playerGuesses: NumberCrunchPlayerGuessView[];
};
