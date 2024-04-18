import Image from "next/image";
import bananaPeelImage from "./banana-peel-01.png";
import { ZombieObstacle } from "./types";

type Props = {
  obstacle: ZombieObstacle;
};

export const ZombieObstacleView = ({ obstacle }: Props) => {
  return <Image src={bananaPeelImage} width={40} alt="banana peel" />;
};
