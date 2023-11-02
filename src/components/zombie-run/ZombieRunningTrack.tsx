import styled from "styled-components";
import { isNumberInRange } from "../../utils/number";
import { Attention } from "../animations/Attention";
import { Zombie } from "./Zombie";
import { ZombieRunPlayer } from "./ZombieRunPlayer";
import {
  ZOMBIE_RUNNING_TRACK_LENGTH_METRES,
  ZombiePlayer,
  ZombieRunEndGameStatus,
  ZombieRunGame,
  ZombieRunGameStatus,
} from "./types";

const TOTAL_TRACK_WIDTH = 94;
const STACK_INDEX_RANGE = 2;

const ZombieBackground = styled.div`
  border: 1px solid #ccc;
  height: 50vh;
  position: relative;
  width: 100vw;
  margin: 0 auto;
  box-sizing: border-box;
  background: url("/images/zombie-background-night.png") no-repeat bottom center;
  background-size: 100% 100%;
`;

const PositionedZombiePlayer = styled.div`
  position: absolute;
  bottom: 1vh;
  transition: left 3s ease-in-out;
  /* border: 1px solid black; */
  box-sizing: border-box;
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

  return (
    <div>
      <ZombieBackground>
        <PositionedZombiePlayer
          style={{
            left: `${
              (TOTAL_TRACK_WIDTH / ZOMBIE_RUNNING_TRACK_LENGTH_METRES) *
              (zombieGame.originalZombie.totalMetresRun - 1)
            }vw`,
          }}
        >
          <Attention animate={zombieParty} animation="slow-vibrate">
            <Zombie />
          </Attention>
        </PositionedZombiePlayer>

        {zombieGame.survivors.map((zp) => {
          return (
            <PositionedZombiePlayer
              key={zp.id}
              style={{
                left: `${
                  (TOTAL_TRACK_WIDTH / ZOMBIE_RUNNING_TRACK_LENGTH_METRES) *
                  (zp.totalMetresRun - 1)
                }vw`,
              }}
            >
              <Attention animate={zombieParty} animation="slow-vibrate">
                <ZombieRunPlayer
                  zombiePlayer={zp}
                  stackIndex={getPlayerStackIndex(zombieGame, zp)}
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
                  (TOTAL_TRACK_WIDTH / ZOMBIE_RUNNING_TRACK_LENGTH_METRES) *
                  (zp.totalMetresRun - 1)
                }vw`,
              }}
            >
              <Attention animate={zombieParty} animation="slow-vibrate">
                <ZombieRunPlayer
                  zombiePlayer={zp}
                  stackIndex={getPlayerStackIndex(zombieGame, zp)}
                />
              </Attention>
            </PositionedZombiePlayer>
          );
        })}
      </ZombieBackground>
      <DistanceMarkerContainer>
        {allMarkers.map((marker) => (
          <DistanceMarker
            key={marker}
            style={{
              left: `${
                (TOTAL_TRACK_WIDTH / ZOMBIE_RUNNING_TRACK_LENGTH_METRES) *
                (marker - 1)
              }vw`,
            }}
          >
            {/* {marker} */}
            {marker % 10 === 0 && marker}
          </DistanceMarker>
        ))}
      </DistanceMarkerContainer>
    </div>
  );
};
