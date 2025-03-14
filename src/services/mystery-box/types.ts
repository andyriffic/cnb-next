export type MysteryBoxGame = {
  id: string;
  players: MysteryBoxPlayer[];
  rounds: MysteryBoxGameRound[];
};

export type MysteryBoxGameRound = {
  boxes: MysteryBox[];
};

export type MysteryBox = {
  contents: MysteryBoxContents;
  playerIds: string[];
};

export type MysteryBoxContents = {};

export type MysteryBoxPlayer = {
  id: string;
  name: string;
};
