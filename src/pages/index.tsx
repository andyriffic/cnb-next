import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { Heading } from "../components/Atoms";

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ImageContainer = styled.div`
  width: 30vw;
  height: 30vw;
  position: relative;
`;

const Home: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Finx Rocks!</title>
      </Head>
      <ImageContainer>
        <Image
          src="/images/finx-rocks-mascot.png"
          layout="fill"
          alt="Finx Rocks mascot of a rock smiling and using a laptop"
        />
      </ImageContainer>
      <Heading>Finx Rocks!</Heading>
      <Link href="/join">Play a game</Link>
    </Container>
  );
};

export default Home;
