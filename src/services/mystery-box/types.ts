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

export type MysteryBoxType = "coin" | "bomb" | "empty" | "points";

export type MysteryBoxContents = {
  type: MysteryBoxType;
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
