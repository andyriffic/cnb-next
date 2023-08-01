import styled, { css } from "styled-components";
import { PlayerAvatar } from "../PlayerAvatar";
import { ZOMBIE_RUNNING_TRACK_LENGTH_METRES, ZombieRunGame } from "./types";
import { Zombie } from "./Zombie";

const TOTAL_TRACK_WIDTH = 95;

const ZombieBackground = styled.div`
  border: 1px solid #ccc;
  height: 50vh;
  position: relative;
  width: ${TOTAL_TRACK_WIDTH}vw;
  margin: 0 auto;
  box-sizing: border-box;
  background: url("/images/zombie-background-day.png");
`;

const ZombiePlayer = styled.div<{ isZombie: boolean }>`
  position: absolute;
  bottom: 1vh;
  transition: left 3s ease-in-out;
  /* border: 1px solid black; */
  box-sizing: border-box;
  ${({ isZombie }) =>
    isZombie &&
    css`
      filter: hue-rotate(90deg);
    `}
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
  border-right: 1px solid red;
  height: 1vh;
  box-sizing: border-box;
  width: ${TOTAL_TRACK_WIDTH / ZOMBIE_RUNNING_TRACK_LENGTH_METRES}vw;
  text-align: right;
  margin: 0;
  padding: 0;
`;

const allMarkers: number[] = Array.from(
  { length: ZOMBIE_RUNNING_TRACK_LENGTH_METRES },
  (_, index) => index + 1
);

type Props = {
  zombieGame: ZombieRunGame;
};

export const ZombieRunningTrack = ({ zombieGame }: Props) => {
  return (
    <div>
      <ZombieBackground>
        {zombieGame.survivors.map((zp) => {
          return (
            <ZombiePlayer
              key={zp.id}
              style={{
                left: `${
                  (TOTAL_TRACK_WIDTH / ZOMBIE_RUNNING_TRACK_LENGTH_METRES) *
                  (zp.totalMetresRun - 1)
                }vw`,
              }}
              isZombie={zp.gotBitten}
            >
              <PlayerAvatar playerId={zp.id} size="thumbnail" />
            </ZombiePlayer>
          );
        })}
        {zombieGame.zombies.map((zp) => {
          return (
            <ZombiePlayer
              key={zp.id}
              style={{
                left: `${
                  (TOTAL_TRACK_WIDTH / ZOMBIE_RUNNING_TRACK_LENGTH_METRES) *
                  (zp.totalMetresRun - 1)
                }vw`,
              }}
              isZombie={true}
            >
              <PlayerAvatar playerId={zp.id} size="thumbnail" />
            </ZombiePlayer>
          );
        })}
        <ZombiePlayer
          style={{
            left: `${
              (TOTAL_TRACK_WIDTH / ZOMBIE_RUNNING_TRACK_LENGTH_METRES) *
              (zombieGame.originalZombie.totalMetresRun - 1)
            }vw`,
          }}
          isZombie={false}
        >
          <Zombie />
        </ZombiePlayer>
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
