import { Player } from "../../types/Player";
import { Heading } from "../Atoms";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { ZombieRunningTrack } from "./ZombieRunningTrack";
import { useZombieRun } from "./useZombieRun";

type Props = {
  players: Player[];
};

const View = ({ players }: Props) => {
  const { zombieGame, run, moveOriginalZombie, moveBittenZombies } =
    useZombieRun(players);

  return (
    <SpectatorPageLayout scrollable={false}>
      <Heading style={{ textAlign: "center" }}>Zombie Run 🧟</Heading>
      <div>
        <ZombieRunningTrack zombieGame={zombieGame} />
      </div>
      <div style={{ marginTop: 30 }}></div>
      <button onClick={run}>RUN!</button>
      <button onClick={moveOriginalZombie}>ORIGINAL ZOMBIE!</button>
      <button onClick={moveBittenZombies}>BITTEN ZOMBIES!</button>
    </SpectatorPageLayout>
  );
};

export default View;
