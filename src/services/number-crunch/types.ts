export type NumberCrunchGame = {
  id: string;
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
  margin: number;
  playerGuesses: NumberCrunchPlayerGuess[];
};

export type NumberCrunchMainPlayer = {
  id: string;
  targetNumber?: number;
};

export type NumberCrunchPlayerGuess = {
  id: string;
  guess: number;
};

export type NumberCrunchGuessResultRange = "exact" | "cold" | "warm" | "hot";

export type NumberCrunchPlayerGuessResult = {
  id: string;
  range: NumberCrunchGuessResultRange;
};
