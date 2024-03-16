import Image from "next/image";
import styled from "styled-components";
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

type Props = {
  zombieDetails: OriginalZombieDetails;
};

export const Zombie = ({ zombieDetails }: Props) => {
  return (
    <div style={{ width: "8vh", height: "10vh", position: "relative" }}>
      <Image src={zombieImage} alt="Zombie" fill={true} />
      {zombieDetails.totalMetresToRun > 0 && (
        <ZombieDisplayDetails>
          ({zombieDetails.totalMetresToRun})
        </ZombieDisplayDetails>
      )}
    </div>
  );
};
