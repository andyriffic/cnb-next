import Image from "next/image";
import styled from "styled-components";
import backgroundImage from "./corgi-decoration.png";
import dirtImage from "./dirt.png";

const Container = styled.div`
  position: relative;
  background: url(${dirtImage.src}) repeat-x bottom left;
  padding-bottom: 40px;
  overflow: hidden;
`;

const BackgroundImage = styled(Image)`
  position: relative;
  display: block;
  max-width: 400px;
  height: 170px;
`;

export function JoinScreenDecoration(): JSX.Element {
  return (
    <Container>
      <BackgroundImage src={backgroundImage} alt="" />
    </Container>
  );
}
