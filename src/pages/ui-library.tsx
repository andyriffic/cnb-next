import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";
import { SmallHeading } from "../components/Atoms";
import { SpectatorPageLayout } from "../components/SpectatorPageLayout";
import { Card } from "../components/migrated/gas-out/Card";

const UiSection = styled.div`
  padding: 3rem;
`;

const UiSectionHeading = styled(SmallHeading)`
  margin-bottom: 3rem;
`;

const Home: NextPage = () => {
  return (
    <SpectatorPageLayout>
      <Head>
        <title>Finx Rocks!</title>
      </Head>
      <UiSection>
        <UiSectionHeading>Balloon game cards</UiSectionHeading>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <Card card={{ presses: 1, type: "press" }} pressesRemaining={1} />
          <Card card={{ presses: 2, type: "press" }} pressesRemaining={2} />
          <Card card={{ presses: 3, type: "press" }} pressesRemaining={3} />
          <Card card={{ presses: 4, type: "press" }} pressesRemaining={4} />
          <Card card={{ presses: 5, type: "press" }} pressesRemaining={5} />
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Card card={{ presses: 0, type: "reverse" }} pressesRemaining={0} />
          <Card card={{ presses: 0, type: "skip" }} pressesRemaining={0} />
          <Card card={{ presses: 5, type: "risky" }} pressesRemaining={5} />
          <Card card={{ presses: 8, type: "bomb" }} pressesRemaining={8} />
        </div>
      </UiSection>
    </SpectatorPageLayout>
  );
};

export default Home;
