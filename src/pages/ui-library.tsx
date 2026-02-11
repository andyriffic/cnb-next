import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";
import { SmallHeading } from "../components/Atoms";
import { SpectatorPageLayout } from "../components/SpectatorPageLayout";
import { BalloonCard } from "../components/migrated/gas-out/BalloonCard";

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
          <BalloonCard
            card={{ presses: 1, type: "press" }}
            pressesRemaining={1}
          />
          <BalloonCard
            card={{ presses: 2, type: "press" }}
            pressesRemaining={2}
          />
          <BalloonCard
            card={{ presses: 3, type: "press" }}
            pressesRemaining={3}
          />
          <BalloonCard
            card={{ presses: 4, type: "press" }}
            pressesRemaining={4}
          />
          <BalloonCard
            card={{ presses: 5, type: "press" }}
            pressesRemaining={5}
          />
          <BalloonCard
            card={{ presses: 0, type: "reverse" }}
            pressesRemaining={0}
          />
          <BalloonCard
            card={{ presses: 0, type: "skip" }}
            pressesRemaining={0}
          />
          <BalloonCard
            card={{ presses: 4, type: "dark-mode" }}
            pressesRemaining={4}
          />
          <BalloonCard
            card={{ presses: 6, type: "curse-all-fives" }}
            pressesRemaining={6}
          />
          <BalloonCard
            card={{ presses: 8, type: "bomb" }}
            pressesRemaining={8}
          />
          <BalloonCard card={{ type: "blank" }} pressesRemaining={8} />
        </div>
      </UiSection>
    </SpectatorPageLayout>
  );
};

export default Home;
