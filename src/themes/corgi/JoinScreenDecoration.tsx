import Image from "next/image";
import styled from "styled-components";
import backgroundImage from "./happy-puppy-image.png";

const Container = styled.div`
  position: relative;
`;

const BackgroundImage = styled(Image)`
  position: relative;
  display: block;
  width: 100%;
`;

export function JoinScreenDecoration(): JSX.Element {
  return (
    <Container>
      <BackgroundImage src={backgroundImage} alt="" />
    </Container>
  );
}
