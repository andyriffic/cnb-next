export type MysteryBoxGame = {
  id: string;
  currentRoundId: number;
  players: MysteryBoxPlayer[];
  rounds: MysteryBoxGameRound[];
};

export type MysteryBoxGameRound = {
  id: number;
  boxes: MysteryBox[];
  specialInfo?: string;
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

export type MysteryBoxCreator = (playersRemaining: number) => (id: number) => {
  boxes: MysteryBox[];
  specialInfo?: string;
};

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
  individualMode?: MysteryBoxIndividualModeView;
};

export type MysteryBoxIndividualModeView = {
  playerId: string;
  roundsSurvivedCount: number;
};

export type MysteryBoxGameOverSummary = {
  outrightWinnerPlayerId?: string;
  maxRoundId: number;
  bonusPointsAwarded: number;
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
  eliminatedRoundId?: number;
};

export type MysteryBoxBoxView = {
  id: number;
  contents: MysteryBoxContents;
  playerIds: string[];
};

export type MysteryBoxGameRoundView = {
  id: number;
  specialInfo?: string;
  status: "in-progress" | "ready" | "complete";
  boxes: MysteryBox[];
};
