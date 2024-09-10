export type MysteryMountainGame = {
  id: string;
  players: MysteryMountainPlayer[];
  levels: MysteryMountainGameLevel[];
};

export type MysteryMountainGameLevel = {
  active: boolean;
  slots: MysteryMountainGameLevelSlot[];
};

export type MysteryMountainGameLevelSlot = {
  state: "waiting" | "safe" | "dropped";
  playerIds: string[];
};

export type MysteryMountainPlayer = {
  id: string;
  name: string;
};
