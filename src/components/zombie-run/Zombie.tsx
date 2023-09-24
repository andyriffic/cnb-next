import Image from "next/image";
import zombieImage from "./zombie.png";

type Props = {};

export const Zombie = ({}: Props) => {
  return (
    <div style={{ width: "8vh", height: "10vh", position: "relative" }}>
      <Image src={zombieImage} alt="Zombie" fill={true} />
    </div>
  );
};
