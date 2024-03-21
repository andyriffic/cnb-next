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
};

export type CardHistory = { playerId: string; cardPlayed: GasCard };

export type GasCloud = {
  pressed: number;
  exploded: boolean;
};

export type DeathType = "balloon" | "timeout" | "boomerang" | "bomb";
export type CurseType = "double-press";

export type GasPlayer = {
  player: Player;
  status: "alive" | "dead" | "winner";
  cards: GasCard[];
  effectPower?: EffectType;
  finishedPosition?: number;
  points: number;
  totalPresses: number;
  killedBy?: DeathType;
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

export type CardType = "press" | "skip" | "reverse" | "risky" | "bomb";

export type GasCard = {
  type: CardType;
  presses: number;
};

export type EffectType = "double";

export type GlobalEffect = {
  type: EffectType;
  playedByPlayerId: string;
};
