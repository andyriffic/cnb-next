import { GetServerSideProps } from "next";
import ZombieScreen from "../components/zombie-run";
import { Player } from "../types/Player";
import { getAllPlayers } from "../utils/data/aws-dynamodb";
import { sortByPlayerName } from "../utils/sort";

type Props = { players: Player[] };

function Page({ players }: Props) {
  return <ZombieScreen players={players} />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const allPlayers = await getAllPlayers();

  const activePlayers = allPlayers
    ? allPlayers
        .filter((p) => !p.details?.retired)
        .filter((p) => !!p.details?.zombieRun)
    : [];

  return {
    props: {
      players: activePlayers.sort(sortByPlayerName),
    },
  };
};

export default Page;
