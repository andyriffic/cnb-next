import { Player } from "../../types/Player";
import { Heading, PrimaryButton } from "../Atoms";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { ZombieRunningTrack } from "./ZombieRunningTrack";
import { ZombieRunGameStatus } from "./types";
import { useZombieRun } from "./useZombieRun";
import { useZombieRunAutoTiming } from "./useZombieRunAutoTiming";
import { useZombieRunSound } from "./useZombieRunSound";

type Props = {
  players: Player[];
};

const View = ({ players }: Props) => {
  const zombieManager = useZombieRun(players);
  useZombieRunAutoTiming(zombieManager);
  useZombieRunSound(zombieManager.zombieGame);

  return (
    <SpectatorPageLayout scrollable={false}>
      <Heading style={{ textAlign: "center" }}>Zombie Run 🧟</Heading>
      <p>{ZombieRunGameStatus[zombieManager.zombieGame.gameStatus]}</p>
      <div>
        <ZombieRunningTrack zombieGame={zombieManager.zombieGame} />
      </div>
      <div style={{ marginTop: 30 }}>
        <PrimaryButton
          onClick={zombieManager.run}
          disabled={
            zombieManager.zombieGame.gameStatus !==
            ZombieRunGameStatus.READY_TO_START
          }
        >
          RUN!
        </PrimaryButton>
        {/* <button
          onClick={zombieManager.moveOriginalZombie}
          disabled={
            zombieManager.zombieGame.gameStatus !==
            ZombieRunGameStatus.READY_FOR_ORIGINAL_ZOMBIE
          }
        >
          ORIGINAL ZOMBIE!
        </button>
        <button
          onClick={zombieManager.moveBittenZombies}
          disabled={
            zombieManager.zombieGame.gameStatus !==
            ZombieRunGameStatus.READY_FOR_BITTEN_ZOMBIES
          }
        >
          BITTEN ZOMBIES!
        </button> */}
      </div>
    </SpectatorPageLayout>
  );
};

export default View;
