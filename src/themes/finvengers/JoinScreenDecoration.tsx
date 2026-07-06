import Image from "next/image";
import styled from "styled-components";
import backgroundImage from "./underwater-image.png";

const Container = styled.div`
  position: relative;
  // background: url(${backgroundImage.src}) repeat-x bottom left;
  overflow: hidden;
`;

const BackgroundImage = styled(Image)`
  position: relative;
  display: block;
  width: 100%;
  height: 170px;
`;

export function JoinScreenDecoration(): JSX.Element {
  return (
    <Container>
      <BackgroundImage src={backgroundImage} alt="" />
    </Container>
  );
}
