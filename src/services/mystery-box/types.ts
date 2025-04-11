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
  winningPlayerId?: string;
  players: MysteryBoxPlayerView[];
  currentRound: MysteryBoxGameRoundView;
  previousRounds: MysteryBoxGameRoundView[];
};

type MysteryBoxPlayerView = {
  status: "waiting" | "selected" | "eliminated";
  eliminatedRoundId?: number;
  lootTotals: {
    [key in MysteryBoxContentsType]: {
      title: string;
      total: number;
    };
  }[];
};

type MysteryBoxGameRoundView = {};
