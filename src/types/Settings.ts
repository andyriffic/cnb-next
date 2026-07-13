type SettingsForCategory<T> = {
  category: string;
  settings: T;
};

export type SettingsCategory =
  | SettingsForCategory<GameSettings>
  | SettingsForCategory<TeamSettings>;

type GameSettings = {
  gameId: string;
  gameName: string;
}[];

export type TeamSettings = {
  teams: { teamId: string; teamName: string }[];
};
