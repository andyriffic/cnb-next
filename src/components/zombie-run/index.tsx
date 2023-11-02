import { Player } from "../../types/Player";
import { isClientSideFeatureEnabled } from "../../utils/feature";
import { Heading, PrimaryButton } from "../Atoms";
import { CenterSpaced } from "../Layouts";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { ZombieParty } from "./ZombieParty";
import { ZombieRunningTrack } from "./ZombieRunningTrack";
import {
  OriginalZombieDetails,
  ZombieRunEndGameStatus,
  ZombieRunGameStatus,
} from "./types";
import { useZombieRun } from "./useZombieRun";
import { useZombieRunAutoTiming } from "./useZombieRunAutoTiming";
import { useZombieRunSound } from "./useZombieRunSound";
import { useZombieSaveState } from "./useZombieSaveState";

type Props = {
  players: Player[];
  originalZombie: OriginalZombieDetails;
};

const View = ({ players, originalZombie }: Props) => {
  const zombieManager = useZombieRun(players, originalZombie);
  useZombieRunAutoTiming(zombieManager);
  useZombieRunSound(zombieManager.zombieGame);
  useZombieSaveState(
    zombieManager.zombieGame,
    isClientSideFeatureEnabled("no-save")
  );

  return (
    <SpectatorPageLayout scrollable={false}>
      <Heading style={{ textAlign: "center" }}>Zombie Run 🧟</Heading>
      <CenterSpaced>
        <PrimaryButton
          onClick={zombieManager.run}
          disabled={
            zombieManager.zombieGame.gameStatus !==
            ZombieRunGameStatus.READY_TO_START
          }
        >
          RUN!
        </PrimaryButton>
      </CenterSpaced>

      {/* <p>{ZombieRunGameStatus[zombieManager.zombieGame.gameStatus]}</p> */}
      <div>
        <ZombieRunningTrack zombieGame={zombieManager.zombieGame} />
        {zombieManager.zombieGame.gameStatus ===
          ZombieRunGameStatus.GAME_OVER &&
          zombieManager.zombieGame.endGameStatus ===
            ZombieRunEndGameStatus.ZOMBIE_PARTY && <ZombieParty />}
      </div>
    </SpectatorPageLayout>
  );
};

export default View;
