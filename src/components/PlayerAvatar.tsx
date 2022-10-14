import Image from "next/future/image";
import styled from "styled-components";
import { Player } from "../types/Player";

const ImageContainer = styled.div`
  /* width: 70vh; */
  height: 90vh;
  display: block;
`;

type Props = {
  player: Player;
};

export const PlayerAvatar = ({ player }: Props): JSX.Element => {
  return (
    <>
      <ImageContainer>
        <Image
          src={`/images/players/${player.id}.png`}
          alt=""
          style={{ width: "60vh", height: "80vh" }}
          width={450}
          height={780}
        />
      </ImageContainer>
    </>
  );
};
