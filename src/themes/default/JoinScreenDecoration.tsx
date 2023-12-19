import styled, { css } from "styled-components";
import Image from "next/image";
import { FlipX } from "../../components/FlipX";
import pixelCinbyImage from "./cinby-pixel-03.png";
import dinosaurImage from "./dino-01.png";
import cactus01Image from "./cactus-01.png";
import cactus02Image from "./catcus-02.png";

const Container = styled.div`
  border-bottom: 50px solid #9c8df5;
  position: relative;
`;

const CactusContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-end;

  position: absolute;
  bottom: 0;
  width: 100%;
`;

const CharacterContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  position: absolute;
  bottom: 0;
  width: 100%;
`;

export function JoinScreenDecoration(): JSX.Element {
  return (
    <Container>
      <CactusContainer>
        <Image src={cactus01Image} alt="" width={50} />
        <FlipX>
          <Image src={cactus02Image} alt="" width={30} />
        </FlipX>
        <Image src={cactus01Image} alt="" width={50} />
        <Image src={cactus02Image} alt="" width={30} />
      </CactusContainer>
      <CharacterContainer>
        <Image src={dinosaurImage} alt="" width={80} />
        <Image src={pixelCinbyImage} alt="" width={40} />
      </CharacterContainer>
    </Container>
  );
}
