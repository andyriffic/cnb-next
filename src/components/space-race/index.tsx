import Image from "next/image";
import { useState } from "react";
import { Player } from "../../types/Player";
import { isClientSideFeatureEnabled } from "../../utils/feature";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { SplashContent } from "../SplashContent";
import { useDoOnce } from "../hooks/useDoOnce";
import { useSound } from "../hooks/useSound";
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
        voidDistance={spaceRace.spaceRaceGame.voidXDistance}
        starmap={spaceRace.spaceRaceGame.starmap}
        players={spaceRace.spaceRaceGame.spacePlayers}
        showGridlines={spaceRace.spaceRaceGame.uiState.showGridlines}
        rocketTrails={spaceRace.spaceRaceGame.rocketTrails}
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
              spaceRace.sendLocationQuestionToPlayers();
            }}
          >
            Start
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
      {/* <div style={{ position: "absolute", bottom: 0 }}>
        <div>Find me</div>
        {Object.values(spaceRace.spaceRaceGame.spacePlayers)
          .filter((p) => !p.highlight)
          .map((player) => (
            <button
              onClick={() => {
                console.log("Highlighting player 1", player.id);
                spaceRace.highlightPlayer(player.id);
              }}
              key={player.id}
            >
              {player.name}
            </button>
          ))}
      </div> */}
    </SpectatorPageLayout>
  );
};

export default View;
