import { GetServerSideProps } from "next";
import ZombieScreen from "../components/zombie-run";
import { Player, getPlayerZombieRunDetails } from "../types/Player";
import { getAllPlayers } from "../utils/data/aws-dynamodb";
import { sortByPlayerName } from "../utils/sort";
import { SETTINGS_PLAYER_ID } from "../constants";
import { OriginalZombieDetails } from "../components/zombie-run/types";

type Props = { players: Player[]; originalZombie: OriginalZombieDetails };

function Page({ players, originalZombie }: Props) {
  return <ZombieScreen players={players} originalZombie={originalZombie} />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const allPlayers = await getAllPlayers();

  const activePlayers = allPlayers
    ? allPlayers
        .filter((p) => !p.details?.retired)
        .filter((p) => !!p.details?.zombieRun)
    : [];

  const settingsPlayer =
    allPlayers && allPlayers.find((p) => p.id === SETTINGS_PLAYER_ID);

  const originalZombieSettings: OriginalZombieDetails = settingsPlayer
    ? {
        totalMetresToRun: settingsPlayer.details?.gameMoves || 0,
        totalMetresRun:
          getPlayerZombieRunDetails(settingsPlayer).totalMetresRun,
      }
    : { totalMetresRun: 0, totalMetresToRun: 0 };

  return {
    props: {
      players: activePlayers.sort(sortByPlayerName),
      originalZombie: originalZombieSettings,
    },
  };
};

export default Page;
