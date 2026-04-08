import Image from "next/image";
import bananaPeelImage from "./banana-peel-01.png";
import { ZombieObstacle } from "./types";

type Props = {
  obstacle: ZombieObstacle;
};

export const ZombieObstacleView = ({ obstacle }: Props) => {
  switch (obstacle.action) {
    case "player-stop":
      return <Image src={bananaPeelImage} width={40} alt={obstacle.name} />;
    case "zombie-boost":
      return <div style={{ fontSize: 24 }}>{obstacle.icon}</div>;
    default:
      return <></>;
  }
};
