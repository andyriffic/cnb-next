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
  currentRound: NumberCrunchRoundView;
};

type NumberCrunchPlayerView = NumberCrunchPlayer & {
  guessedThisRound: boolean;
};

type NumberCrunchRoundView = {
  range: NumberCrunchRoundRange;
  playerGuesses: {
    playerId: string;
    offBy: number;
  }[];
};
