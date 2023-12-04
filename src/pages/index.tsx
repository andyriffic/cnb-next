import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import finxMascotImage from "../assets/finx-mascot.png";
import { Appear } from "../components/animations/Appear";

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Home: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Finx Rocks!</title>
      </Head>
      <Appear animation="flip-in">
        <Image
          src={finxMascotImage}
          alt="Finx Rocks mascot of a rock smiling and using a laptop"
        />
      </Appear>
      <Link href="/join">Play a game</Link>
    </Container>
  );
};

export default Home;
