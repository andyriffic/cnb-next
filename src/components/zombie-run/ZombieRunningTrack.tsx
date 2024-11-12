import Image from "next/image";
import styled from "styled-components";
import { isNumberInRange } from "../../utils/number";
import { Attention } from "../animations/Attention";
import bewareBananaSignImage from "./beware-banana-02.png";
import {
  ZOMBIE_RUNNING_TRACK_LENGTH_METRES,
  ZombiePlayer,
  ZombieRunEndGameStatus,
  ZombieRunGame,
  ZombieRunGameStatus,
} from "./types";
import { Zombie } from "./Zombie";
import { ZombieObstacleView } from "./ZombieObstacle";
import { ZombieRunPlayer } from "./ZombieRunPlayer";

const TOTAL_TRACK_WIDTH = 94;
const STACK_INDEX_RANGE = 2;

const ZombieBackground = styled.div`
  border: 1px solid #ccc;
  height: 50vh;
  position: relative;
  width: 100vw;
  margin: 0 auto;
  box-sizing: border-box;
  background: url("/images/zombie-background-dusk.png") no-repeat bottom right;
  // background-size: 150% 100%;
  // background-position: 100% 100%;
  transition: background 3s ease-in-out;
`;

const PositionedZombiePlayer = styled.div`
  position: absolute;
  bottom: 1vh;
  transition: left 3s ease-in-out;
  /* border: 1px solid black; */
  box-sizing: border-box;
  transform: translateX(-50%);
`;

const ZombieCharactersContainer = styled.div`
  /* position: relative; */
  width: ${TOTAL_TRACK_WIDTH}vw;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 0;
`;

const DistanceMarkerContainer = styled.div`
  position: relative;
  /* border: 1px solid black; */
  width: ${TOTAL_TRACK_WIDTH}vw;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 0;
`;

const DistanceMarker = styled.div`
  position: absolute;
  top: 0;
  /* border-right: 1px solid red; */
  height: 1vh;
  box-sizing: border-box;
  width: ${TOTAL_TRACK_WIDTH / ZOMBIE_RUNNING_TRACK_LENGTH_METRES}vw;
  text-align: right;
  margin: 0;
  padding: 0;
  font-weight: bold;
`;

const PositionedObstacle = styled.div`
  position: absolute;
  bottom: 0;
`;

const BewareSign = styled.div`
  position: absolute;
  bottom: 5vh;
  left: 55vw;
`;

const allMarkers: number[] = Array.from(
  { length: ZOMBIE_RUNNING_TRACK_LENGTH_METRES },
  (_, index) => index + 1
);

const sortByZombiePlayerDistance = (a: ZombiePlayer, b: ZombiePlayer) => {
  return a.totalMetresRun - b.totalMetresRun;
};

const getPlayerStackIndex = (
  zombieGame: ZombieRunGame,
  zp: ZombiePlayer
): number => {
  const combinedZombiePlayersInRange = zombieGame.survivors
    .concat(zombieGame.zombies)
    .sort(sortByZombiePlayerDistance)
    .filter((z) =>
      isNumberInRange(
        z.totalMetresRun,
        zp.totalMetresRun - STACK_INDEX_RANGE,
        zp.totalMetresRun + STACK_INDEX_RANGE
      )
    );
  const stackIndex = combinedZombiePlayersInRange.findIndex(
    (p) => p.id === zp.id
  );
  return stackIndex;
};

type Props = {
  zombieGame: ZombieRunGame;
};

export const ZombieRunningTrack = ({ zombieGame }: Props) => {
  const zombieParty =
    zombieGame.gameStatus === ZombieRunGameStatus.GAME_OVER &&
    zombieGame.endGameStatus === ZombieRunEndGameStatus.ZOMBIE_PARTY;

  const minDistance = Math.max(zombieGame.originalZombie.totalMetresRun - 5, 0);
  const totalTrackVisibleMetres =
    ZOMBIE_RUNNING_TRACK_LENGTH_METRES - minDistance;

  return (
    <div>
      <ZombieBackground
        style={{
          backgroundSize: `${
            (ZOMBIE_RUNNING_TRACK_LENGTH_METRES / totalTrackVisibleMetres) * 100
          }% 100%`,
        }}
      >
        <BewareSign>
          <Image
            src={bewareBananaSignImage}
            width={100}
            alt="A sign indicating to beware of bananas"
          />
        </BewareSign>
        <ZombieCharactersContainer>
          <PositionedZombiePlayer
            style={{
              left: `${
                zombieGame.endGameStatus === ZombieRunEndGameStatus.ZOMBIE_PARTY
                  ? 2
                  : (TOTAL_TRACK_WIDTH / totalTrackVisibleMetres) *
                    (zombieGame.originalZombie.totalMetresRun - minDistance)
              }vw`,
            }}
          >
            <Attention animate={zombieParty} animation="slow-vibrate">
              <Zombie zombieDetails={zombieGame.originalZombie} />
            </Attention>
          </PositionedZombiePlayer>

          {zombieGame.survivors.map((zp) => {
            return (
              <PositionedZombiePlayer
                key={zp.id}
                style={{
                  left: `${
                    zombieGame.endGameStatus ===
                    ZombieRunEndGameStatus.ZOMBIE_PARTY
                      ? zombieGame.survivors.findIndex((z) => z.id === zp.id) *
                          3 +
                        10
                      : (TOTAL_TRACK_WIDTH / totalTrackVisibleMetres) *
                        (zp.totalMetresRun - minDistance)
                  }vw`,
                }}
              >
                <Attention animate={zombieParty} animation="slow-vibrate">
                  <ZombieRunPlayer
                    zombiePlayer={zp}
                    stackIndex={getPlayerStackIndex(zombieGame, zp)}
                    endGameStatus={zombieGame.endGameStatus}
                  />
                </Attention>
              </PositionedZombiePlayer>
            );
          })}
          {zombieGame.zombies.map((zp) => {
            return (
              <PositionedZombiePlayer
                key={zp.id}
                style={{
                  left: `${
                    zombieGame.endGameStatus ===
                    ZombieRunEndGameStatus.ZOMBIE_PARTY
                      ? zombieGame.zombies.findIndex((z) => z.id === zp.id) *
                          3 +
                        5 +
                        zombieGame.survivors.length * 3
                      : (TOTAL_TRACK_WIDTH / totalTrackVisibleMetres) *
                        (zp.totalMetresRun - minDistance)
                  }vw`,
                }}
              >
                <Attention animate={zombieParty} animation="slow-vibrate">
                  <ZombieRunPlayer
                    zombiePlayer={zp}
                    stackIndex={getPlayerStackIndex(zombieGame, zp)}
                    endGameStatus={zombieGame.endGameStatus}
                  />
                </Attention>
              </PositionedZombiePlayer>
            );
          })}
          {zombieGame.obstacles.map((obstacle, i) => {
            return (
              <PositionedObstacle
                key={i}
                style={{
                  left: `${
                    (TOTAL_TRACK_WIDTH / totalTrackVisibleMetres) *
                    (obstacle.index - minDistance)
                  }vw`,
                }}
              >
                <ZombieObstacleView obstacle={obstacle} />
              </PositionedObstacle>
            );
          })}
        </ZombieCharactersContainer>
      </ZombieBackground>
      {/* <DistanceMarkerContainer>
        {allMarkers.map((marker) => (
          <DistanceMarker
            key={marker}
            style={{
              left: `${
                (TOTAL_TRACK_WIDTH / ZOMBIE_RUNNING_TRACK_LENGTH_METRES) *
                marker
              }vw`,
            }}
          >
            {marker % 10 === 0 && marker}
          </DistanceMarker>
        ))}
      </DistanceMarkerContainer> */}
    </div>
  );
};
