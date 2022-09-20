import Image from "next/image";
import styled from "styled-components";
import { Player } from "../types/Player";

const ImageContainer = styled.div`
  width: 40vw;
  height: 50vw;
  display: block;
`;

type Props = {
  player: Player;
};

export const PlayerAvatar = ({ player }: Props): JSX.Element => {
  return (
    <>
      <h2>{player.name}</h2>
      <ImageContainer>
        <Image
          src={`/images/players/${player.id}.png`}
          alt=""
          width={80}
          height={120}
          layout="responsive"
        />
      </ImageContainer>
    </>
  );
};
