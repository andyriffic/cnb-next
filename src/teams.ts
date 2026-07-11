export type TeamId = "none" | "corgi" | "finvengers";

export type TeamDetails = {
  id: TeamId;
  name: string;
  backgroundColor: string;
  textColor: string;
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
  },
  corgi: {
    id: "corgi",
    name: "Corgi",
    backgroundColor: "#1c7721",
    textColor: "#fff",
  },
  finvengers: {
    id: "finvengers",
    name: "Finvengers",
    backgroundColor: "#2F5FD0",
    textColor: "#fff",
  },
};
