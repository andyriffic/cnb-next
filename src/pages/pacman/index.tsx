import { GetServerSideProps } from "next";
import PacmanScreen from "../../components/pacman";
import { getAllPlayers } from "../../utils/data/aws-dynamodb";
import { sortByPlayerName } from "../../utils/sort";
import { Player } from "../../types/Player";
import { SETTINGS_PLAYER_ID } from "../../constants";

type Props = { players: Player[]; pacmanStartingIndex: number };

function Page({ players, pacmanStartingIndex }: Props) {
  return (
    <PacmanScreen players={players} pacmanStartingIndex={pacmanStartingIndex} />
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const allPlayers = await getAllPlayers();

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
    },
  };
};

export default Page;
