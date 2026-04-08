import Image from "next/image";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { fadeInBottom } from "../animations/keyframes/fade";
import { useSound } from "../hooks/useSound";
import zombieImage from "./zombie.png";
import { OriginalZombieDetails } from "./types";
import { ZOMBIE_COLOR } from "./ZombieRunPlayer";

const ZombieDisplayDetails = styled.div`
  background: ${ZOMBIE_COLOR};
  color: white;
  text-align: center;
  padding: 0.2rem 0.5rem;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  margin: 0 0.5rem;
  transition: background 1s ease-in-out;
  position: absolute;
  bottom: -3vh;
`;

const BittenIndicator = styled.div`
  position: absolute;
  background: ${ZOMBIE_COLOR}};
  color: white;
  text-align: center;
  padding: 0.2rem;
  font-size: 1rem;
  animation: ${fadeInBottom} 2s ease-in-out 0.8s 1 both;
  border-radius: 0.5rem;
  top: -20%;
`;

const ObstacleIndicator = styled(BittenIndicator)`
  background: black;
  color: yellow;
`;

type Props = {
  zombieDetails: OriginalZombieDetails;
};

export const Zombie = ({ zombieDetails }: Props) => {
  const { play } = useSound();

  useEffect(() => {
    if (zombieDetails.boost) {
      play("zombie-run-zombie-boost");
    }
  }, [play, zombieDetails.boost]);

  return (
    <div style={{ width: "8vh", height: "10vh", position: "relative" }}>
      <Image src={zombieImage} alt="Zombie" fill={true} />
      {zombieDetails.boost && (
        <ObstacleIndicator>Braaaaiiiiins</ObstacleIndicator>
      )}

      {zombieDetails.totalMetresToRun > 0 && (
        <ZombieDisplayDetails>
          ({zombieDetails.totalMetresToRun})
        </ZombieDisplayDetails>
      )}
    </div>
  );
};
