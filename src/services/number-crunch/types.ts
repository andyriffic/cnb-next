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
};

export type NumberCrunchGuessResultRange = "exact" | "cold" | "warm" | "hot";

export type NumberCrunchPlayerGuessResult = {
  id: string;
  range: NumberCrunchGuessResultRange;
};

export type NumberCrunchGameView = {
  id: string;
  roundNumber: number;
  players: NumberCrunchPlayer[];
  currentRound: NumberCrunchRound;
};
