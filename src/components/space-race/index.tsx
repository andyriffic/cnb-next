import { Player } from "../../types/Player";
import { isClientSideFeatureEnabled } from "../../utils/feature";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { StarMap } from "./Starmap";
import { useSpaceRace } from "./useSpaceRace";

type Props = {
  players: Player[];
};

const View = ({ players }: Props) => {
  const spaceRace = useSpaceRace(
    players,
    isClientSideFeatureEnabled("no-save")
  );

  console.log("Space race state", spaceRace.spaceRaceGame);

  return (
    <SpectatorPageLayout scrollable={false}>
      <StarMap
        starmap={spaceRace.spaceRaceGame.starmap}
        players={spaceRace.spaceRaceGame.spacePlayers}
        showGridlines={spaceRace.spaceRaceGame.uiState.showGridlines}
      />
      <div style={{ position: "absolute", right: 0 }}>
        {/* <button onClick={spaceRace.randomlyPlotAllPlayerCourses}>
          Lock in course
        </button>
        <button onClick={spaceRace.moveAllPlayersVertically}>
          Move vertially
        </button>
        <button onClick={spaceRace.moveAllPlayersHorizontally}>
          Move horizontally
        </button> */}
        <button onClick={spaceRace.sendCourseQuestionToPlayers}>
          send course
        </button>
        {/* <DebugSpaceRace useSpaceRace={spaceRace} /> */}
      </div>
    </SpectatorPageLayout>
  );
};

export default View;
