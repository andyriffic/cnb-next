import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback } from "react";
import styled from "styled-components";

import {
  FeatureHeading,
  FeatureSubHeading,
  ThemedPrimaryButton,
} from "../../components/Atoms";
import { CenterSpaced } from "../../components/Layouts";
import { SpectatorPageLayout } from "../../components/SpectatorPageLayout";
import { Appear } from "../../components/animations/Appear";
import { useSocketIo } from "../../providers/SocketIoProvider";
import cinbyWave from "../../assets/finx-mascot-space.png";

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function Page() {
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
    <SpectatorPageLayout>
      <Container>
        <CenterSpaced style={{ alignItems: "flex-end" }}>
          <Appear animation="flip-in">
            <Image src={cinbyWave} alt="" width={200} />
          </Appear>
          <div style={{ marginBottom: "0rem" }}>
            <FeatureSubHeading style={{ marginBottom: "0rem" }}>
              Welcome to
            </FeatureSubHeading>
            <FeatureHeading>CNB</FeatureHeading>
          </div>
        </CenterSpaced>
        <ThemedPrimaryButton onClick={() => startNewGame()}>
          Create a game
        </ThemedPrimaryButton>
      </Container>
    </SpectatorPageLayout>
  );
}

export default Page;
