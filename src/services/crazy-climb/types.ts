export type CrazyClimbGame = {
  id: string;
  players: CrazyClimbPlayer[];
  levels: CrazeyClimbGameLevel[];
};

export type CrazeyClimbGameLevel = {
  status: "open" | "closed";
  platforms: CrazyClimbGameLevelPlatform[];
};

export type CrazyClimbGameLevelPlatform = {
  state: "waiting" | "safe" | "dropped";
  playerIds: string[];
};

export type CrazyClimbPlayer = {
  id: string;
  name: string;
};
