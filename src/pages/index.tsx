import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import finxMascotImage from "../assets/finx-mascot-space.png";
import { Appear } from "../components/animations/Appear";
import { spinAnimation } from "../components/animations/keyframes/spinAnimations";

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Space = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  background-image: url("/images/space-background-01.jpg");
  background-size: 100% 100%;
`;

const StyledLink = styled(Link)`
  color: white;
`;

const PositionContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const SpinContainer = styled.div`
  animation: ${spinAnimation} 20s linear infinite;
  transform-origin: 25% 25%;
`;

const Home: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Finx Rocks!</title>
      </Head>
      <Space>
        <PositionContainer>
          <SpinContainer>
            <Image
              src={finxMascotImage}
              alt="Finx Rocks mascot of a rock smiling and using a laptop"
              width={300}
            />
          </SpinContainer>
          <StyledLink href="/join">Play a game</StyledLink>
        </PositionContainer>
      </Space>
    </Container>
  );
};

export default Home;
