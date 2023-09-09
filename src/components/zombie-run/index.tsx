import { Player } from "../../types/Player";
import { Heading } from "../Atoms";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { SplashContent } from "../SplashContent";
import { ZombieRunningTrack } from "./ZombieRunningTrack";
import { ZombieRunGameStatus } from "./types";
import { useZombieRun } from "./useZombieRun";
import { useZombieRunSound } from "./useZombieRunSound";

type Props = {
  players: Player[];
};

const View = ({ players }: Props) => {
  const { zombieGame, run, moveOriginalZombie, moveBittenZombies } =
    useZombieRun(players);
  useZombieRunSound(zombieGame);

  return (
    <SpectatorPageLayout scrollable={false}>
      <Heading style={{ textAlign: "center" }}>Zombie Run 🧟</Heading>
      <p>{ZombieRunGameStatus[zombieGame.gameStatus]}</p>
      <div>
        <ZombieRunningTrack zombieGame={zombieGame} />
      </div>
      {zombieGame.gameStatus === ZombieRunGameStatus.PLAYERS_RUNNING && (
        <SplashContent showForMilliseconds={300}>
          <Heading>RUN!!</Heading>
        </SplashContent>
      )}
      <div style={{ marginTop: 30 }}>
        <button
          onClick={run}
          disabled={
            zombieGame.gameStatus !== ZombieRunGameStatus.READY_TO_START
          }
        >
          RUN!
        </button>
        <button
          onClick={moveOriginalZombie}
          disabled={
            zombieGame.gameStatus !==
            ZombieRunGameStatus.READY_FOR_ORIGINAL_ZOMBIE
          }
        >
          ORIGINAL ZOMBIE!
        </button>
        <button
          onClick={moveBittenZombies}
          disabled={
            zombieGame.gameStatus !==
            ZombieRunGameStatus.READY_FOR_BITTEN_ZOMBIES
          }
        >
          BITTEN ZOMBIES!
        </button>
      </div>
    </SpectatorPageLayout>
  );
};

export default View;
