import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import finxMascotImage from "../assets/finx-mascot.png";
import {
  FeatureHeading,
  FeatureSubHeading,
  ThemedPrimaryLinkButton,
} from "../components/Atoms";
import { CenterSpaced } from "../components/Layouts";
import { SpectatorPageLayout } from "../components/SpectatorPageLayout";
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
    <SpectatorPageLayout>
      <Head>
        <title>Finx Rocks!</title>
      </Head>
      <Container>
        <CenterSpaced>
          <Appear animation="flip-in">
            <Image
              src={finxMascotImage}
              alt="Finx Rocks mascot of a rock smiling and using a laptop"
              width={200}
            />
          </Appear>
          <div style={{ marginBottom: "2rem" }}>
            <FeatureSubHeading style={{ marginBottom: "2rem" }}>
              Welcome to
            </FeatureSubHeading>
            <FeatureHeading>CNB</FeatureHeading>
          </div>
        </CenterSpaced>
        <ThemedPrimaryLinkButton href="/join">
          Play a game
        </ThemedPrimaryLinkButton>
        {/* <Link href="/join">Play a game</Link> */}
      </Container>
    </SpectatorPageLayout>
  );
};

export default Home;
