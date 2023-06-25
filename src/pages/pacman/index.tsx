import { GetServerSideProps } from "next";
import PacmanScreen from "../../components/pacman";
import { getAllPlayers } from "../../utils/data/aws-dynamodb";
import { sortByPlayerName } from "../../utils/sort";
import { Player } from "../../types/Player";

type Props = { players: Player[] };

function Page({ players }: Props) {
  return <PacmanScreen players={players} />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const allPlayers = await getAllPlayers();

  const activePlayers = allPlayers
    ? allPlayers.filter((p) => !p.tags.includes("retired"))
    : [];

  return {
    props: {
      players: activePlayers.sort(sortByPlayerName),
    },
  };
};

export default Page;
