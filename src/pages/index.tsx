import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useCallback } from "react";
import finxMascotImage from "../assets/cinby-india.png";
import { Appear } from "../components/animations/Appear";
import { spinAnimation } from "../components/animations/keyframes/spinAnimations";
import { useSocketIo } from "../providers/SocketIoProvider";

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
  background-image: url("/images/cinby-indian-background.png");
  background-size: 100% 100%;
`;

const StyledLink = styled(Link)`
  color: white;
  background-color: brown;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
`;

const PositionContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const SpinContainer = styled.div`
  animation: ${spinAnimation} 20s linear infinite;
  transform-origin: 25% 25%;
`;

const Home: NextPage = () => {
  const router = useRouter();
  const { groupJoin } = useSocketIo();

  const startNewGame = useCallback(
    (team?: string) => {
      console.log("Creating New Player Group...");

      groupJoin.createPlayerGroup((groupId) => {
        console.log("Group Created", groupId);
        router.push(`/join/${groupId}${team ? `?team=${team}` : ""}`);
      });
    },
    [groupJoin, router]
  );

  return (
    <Container>
      <Head>
        <title>Finx Rocks!</title>
      </Head>
      <Space>
        <PositionContainer>
          {/* <SpinContainer> */}
          <Image
            src={finxMascotImage}
            alt="Finx Rocks mascot of a rock smiling and using a laptop"
            width={200}
          />
          {/* </SpinContainer> */}
          <StyledLink href="/join">Play a game</StyledLink>
        </PositionContainer>
      </Space>
    </Container>
  );
};

export default Home;
