import { GetServerSideProps } from "next";
import PacmanScreen from "../../components/pacman";
import { getAllPlayers } from "../../utils/data/aws-dynamodb-players";
import { sortByPlayerName } from "../../utils/sort";
import { Player } from "../../types/Player";
import { SETTINGS_PLAYER_ID } from "../../constants";

type Props = {
  players: Player[];
  pacmanStartingIndex: number;
  team: string | null;
};

function Page({ players, pacmanStartingIndex, team }: Props) {
  return (
    <PacmanScreen
      players={players}
      pacmanStartingIndex={pacmanStartingIndex}
      team={team || undefined}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const allPlayers = await getAllPlayers();
  const { team } = query;

  const activePlayers = allPlayers
    ? allPlayers.filter((p) => !p.tags.includes("retired"))
    : [];

  const pacmanStartingIndex = allPlayers
    ? allPlayers.find((p) => p.id === SETTINGS_PLAYER_ID)?.details
        ?.pacmanDetails?.index
    : 0;

  return {
    props: {
      players: activePlayers.sort(sortByPlayerName),
      pacmanStartingIndex,
      team: team ? (team as string) : null,
    },
  };
};

export default Page;
