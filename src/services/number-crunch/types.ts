export type NumberCrunchGame = {
  id: string;
  target: number;
  rounds: NumberCrunchRound[];
  players: NumberCrunchPlayer[];
};

type NumberCrunchPlayer = {
  id: string;
  name: string;
  advantage: boolean;
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
  guessedNumbers: number[];
  finalResults?: NumberCrunchFinalResultsView;
  guessedInFirstRound: boolean;
};

export type NumberCrunchPlayerView = NumberCrunchPlayer & {
  guessedThisRound: boolean;
  advantage: boolean;
  extraHint?: string;
};

export type NumberCrunchPlayerGuessView = {
  playerId: string;
  bucketRangeIndex: number;
  guess: number;
};

export type NumberCrunchRoundView = {
  roundNumber: number;
  range: NumberCrunchRoundRange;
  allPlayersGuessed: boolean;
  playerGuesses: NumberCrunchPlayerGuessView[];
};

export type NumberCrunchFinalResultsView = {
  target: number;
  winningPlayerIds: string[];
  allRounds: NumberCrunchFinalResultsRoundView[];
  finalRoundSummary: NumberCrunchFinalRoundSummaryView[];
};

type NumberCrunchFinalResultsRoundView = {
  playerGuesses: NumberCrunchFinalResultsRoundPlayerGuessView[];
};

export type NumberCrunchFinalResultsRoundPlayerGuessView = {
  playerId: string;
  guess: number;
};

export type NumberCrunchFinalRoundSummaryView = {
  guess: number;
  playerIds: string[];
  bucketRangeIndex: number;
};
