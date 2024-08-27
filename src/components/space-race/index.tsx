import Image from "next/image";
import { useState } from "react";
import { Player } from "../../types/Player";
import { isClientSideFeatureEnabled } from "../../utils/feature";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { SplashContent } from "../SplashContent";
import { useSound } from "../hooks/useSound";
import { useDoOnce } from "../hooks/useDoOnce";
import { StarMap } from "./Starmap";
import { useSpaceRace } from "./useSpaceRace";

type Props = {
  players: Player[];
};

const View = ({ players }: Props) => {
  const { play } = useSound();
  const [showPlotCourse, setShowPlotCourse] = useState(false);
  const spaceRace = useSpaceRace(
    players,
    isClientSideFeatureEnabled("no-save")
  );

  useDoOnce(() => {
    play("space-race-intro");
  });

  console.log("Space race state", spaceRace.spaceRaceGame);

  return (
    <SpectatorPageLayout scrollable={false}>
      <StarMap
        starmap={spaceRace.spaceRaceGame.starmap}
        players={spaceRace.spaceRaceGame.spacePlayers}
        showGridlines={spaceRace.spaceRaceGame.uiState.showGridlines}
      />
      {!showPlotCourse && (
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
          <button
            onClick={() => {
              play("space-race-plot-course");
              setShowPlotCourse(true);
              spaceRace.sendCourseQuestionToPlayers();
            }}
          >
            send course
          </button>
          {/* <DebugSpaceRace useSpaceRace={spaceRace} /> */}
        </div>
      )}
      <SplashContent>
        <Image
          src="/images/space-race-text.png"
          alt="Space Race"
          width={480}
          height={48}
        />
      </SplashContent>
      {showPlotCourse && (
        <SplashContent>
          <Image
            src="/images/plot-your-course-text.png"
            alt="Plot your course"
            width={777}
            height={60}
          />
        </SplashContent>
      )}
    </SpectatorPageLayout>
  );
};

export default View;
