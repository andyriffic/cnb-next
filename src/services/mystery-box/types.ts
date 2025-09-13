export type MysteryBoxGame = {
  id: string;
  currentRoundId: number;
  players: MysteryBoxPlayer[];
  rounds: MysteryBoxGameRound[];
};

export type MysteryBoxGameRound = {
  id: number;
  boxes: MysteryBox[];
};

export type MysteryBox = {
  id: number;
  isOpen: boolean;
  contents: MysteryBoxContents;
  playerIds: string[];
};

export type MysteryBoxContentsType = "coin" | "bomb" | "empty" | "points";

export type MysteryBoxContents = {
  type: MysteryBoxContentsType;
  value: number;
};

export type MysteryBoxPlayer = {
  id: string;
  name: string;
  advantage: boolean;
};

export type MysteryBoxCreator = (id: number) => MysteryBox[];

//Helper tyoes?

export type MysteryBoxGameWithRound = {
  game: MysteryBoxGame;
  round: MysteryBoxGameRound;
};

// Views
export type MysteryBoxGameView = {
  id: string;
  // winningPlayerIds?: string[];
  players: MysteryBoxPlayerView[];
  currentRound: MysteryBoxGameRoundView;
  previousRounds: MysteryBoxGameRoundView[];
  gameOverSummary?: MysteryBoxGameOverSummary;
};

export type MysteryBoxGameOverSummary = {
  outrightWinnerPlayerId?: string;
};

export type MysteryBoxPlayerStatus =
  | "waiting"
  | "selected"
  | "eliminated"
  | "winner";

export type MysteryBoxLootTotalsByType = {
  [key in MysteryBoxContentsType]?: {
    title: string;
    total: number;
  };
};

export type MysteryBoxPlayerView = {
  id: string;
  name: string;
  advantage: boolean;
  status: MysteryBoxPlayerStatus;
  // eliminatedRoundId?: number;
  currentlySelectedBoxId?: number;
  lootTotals: MysteryBoxLootTotalsByType;
};

export type MysteryBoxBoxView = {
  id: number;
  contents: MysteryBoxContents;
  playerIds: string[];
};

export type MysteryBoxGameRoundView = {
  id: number;
  status: "in-progress" | "ready" | "complete";
  boxes: MysteryBox[];
};
