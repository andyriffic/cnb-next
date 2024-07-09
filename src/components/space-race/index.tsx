import { useCallback } from "react";
import { Player } from "../../types/Player";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { selectRandomOneOf } from "../../utils/random";
import { StarMap } from "./Starmap";
import { useSpaceRace } from "./useSpaceRace";
import { DebugSpaceRace } from "./DebugSpaceRace";

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
      <div style={{ position: "absolute", right: 0 }}>
        <button onClick={spaceRace.randomlyPlotAllPlayerCourses}>
          Lock in course
        </button>
        <button onClick={spaceRace.moveAllPlayersVertically}>
          Move vertially
        </button>
        <button onClick={spaceRace.moveAllPlayersHorizontally}>
          Move horizontally
        </button>
        <button onClick={spaceRace.sendCourseQuestionToPlayers}>
          send course
        </button>
        <DebugSpaceRace useSpaceRace={spaceRace} />
      </div>
    </SpectatorPageLayout>
  );
};

export default View;
