export enum SettingsCategory {
  team = "team",
  game = "game",
}

export type TeamSettings = {
  teams: { teamId: string; teamName: string }[];
};

export type GameSettings = {
  games: { gameId: string; gameName: string }[];
};

export type Settings = {
  [SettingsCategory.team]: TeamSettings;
  [SettingsCategory.game]: GameSettings;
};
