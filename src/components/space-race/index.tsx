import { useCallback } from "react";
import { Player } from "../../types/Player";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { selectRandomOneOf } from "../../utils/random";
import { StarMap } from "./Starmap";
import { useSpaceRace } from "./useSpaceRace";

type Props = {
  players: Player[];
};

const View = ({ players }: Props) => {
  const spaceRace = useSpaceRace(players);

  console.log("Space race state", spaceRace.spaceRaceGame);

  return (
    <SpectatorPageLayout scrollable={false}>
      <StarMap
        starmap={spaceRace.spaceRaceGame.starmap}
        players={spaceRace.spaceRaceGame.spacePlayers}
      />
      <div style={{ position: "absolute" }}>
        <button onClick={spaceRace.randomlyPlotAllPlayerCourses}>
          Lock in course
        </button>
        <button onClick={spaceRace.moveAllPlayersVertically}>
          Move vertially
        </button>
        <button onClick={spaceRace.moveAllPlayersHorizontally}>
          Move horizontally
        </button>
      </div>
    </SpectatorPageLayout>
  );
};

export default View;
