import CORGI_THEME, { DEFAULT_THEME, FINVENGERS_THEME } from "./themes";
import { GlobalGameTheme } from "./themes/types";

export type TeamId = "none" | "corgi" | "finvengers";

export type TeamDetails = {
  id: TeamId;
  name: string;
  backgroundColor: string;
  textColor: string;
  mascotImageUrl: string;
  theme: GlobalGameTheme;
};

export const getTeamDetails = (
  team: string | undefined | null,
): TeamDetails => {
  const sanitisedTeam = team?.toLowerCase() || "";

  if (!sanitisedTeam || !["corgi", "finvengers"].includes(sanitisedTeam)) {
    return TEAM_DETAILS.none;
  }
  const teamId = sanitisedTeam as TeamId;
  return TEAM_DETAILS[teamId];
};

export const TEAM_DETAILS: { [key in TeamId]: TeamDetails } = {
  none: {
    id: "none",
    name: "-",
    backgroundColor: "transparent",
    textColor: "transparent",
    mascotImageUrl: "/images/finx-mascot.png",
    theme: DEFAULT_THEME,
  },
  corgi: {
    id: "corgi",
    name: "Corgi",
    backgroundColor: "#1c7721",
    textColor: "#fff",
    mascotImageUrl: "/images/teams/corgi/corgi-mascot-square.png",
    theme: CORGI_THEME,
  },
  finvengers: {
    id: "finvengers",
    name: "Finvengers",
    backgroundColor: "#2F5FD0",
    textColor: "#fff",
    mascotImageUrl: "/images/teams/finvengers/finvengers-mascot-square.png",
    theme: FINVENGERS_THEME,
  },
};
