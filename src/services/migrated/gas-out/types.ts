import { Player } from "../../../types/Player";

export type Direction = "left" | "right";

export type GasGameType = "normal" | "quick" | "crazy";

export type GasGame = {
  id: string;
  gameType: GasGameType;
  allPlayers: GasPlayer[];
  alivePlayersIds: string[];
  deadPlayerIds: string[];
  winningPlayerId?: string;
  direction: Direction;
  currentPlayer: {
    id: string;
    cardPlayed?: GasCard;
    pressesRemaining: number;
  };
  gasCloud: GasCloud;
  pointsMap: number[];
  globalEffect?: GlobalEffect;
  mvpPlayerIds?: {
    mostCorrectGuesses: string[];
    mostPresses: string[];
  };
  moveHistory: CardHistory[];
  turnCount: number;
  team?: string;
  superGuessInEffect: boolean;
  potentialSuperGuessStillAvailable: boolean;
};

export type CardHistory = { playerId: string; cardPlayed: GasCard };

export type GasCloud = {
  pressed: number;
  exploded: boolean;
};

export type DeathType = "balloon" | "timeout" | "boomerang" | "bomb";
export type CurseType = "double-press" | "all-fives" | "dark-mode";
export type PlayerKilledBy = {
  playerId: string;
  deathType: DeathType;
};

export type GasPlayer = {
  player: Player;
  status: "alive" | "dead" | "winner";
  cards: GasCard[];
  effectPower?: EffectType;
  finishedPosition?: number;
  points: number;
  totalPresses: number;
  killedBy?: PlayerKilledBy;
  advantage: boolean;
  guesses: {
    nextPlayerOutGuess?: string;
    nominatedCount: number;
    correctGuessCount: number;
  };
  pointsAllocation: {
    base: number;
    correctGuesses: number;
    mostPresses: number;
    mostCorrectGuesses: number;
  };
  curse?: CurseType;
};

export type CardType =
  | "press"
  | "skip"
  | "reverse"
  | "dark-mode"
  | "bomb"
  | "curse-all-fives";

export type GasCard = {
  type: CardType;
  presses: number;
};

export type EffectType = "double" | "random-explode" | "lights-out";

export type GlobalEffect = {
  type: EffectType;
  playedByPlayerId: string;
};
