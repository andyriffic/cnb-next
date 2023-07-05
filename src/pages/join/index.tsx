import { useRouter } from "next/router";
import { useCallback } from "react";
import styled from "styled-components";
import { SpectatorPageLayout } from "../../components/SpectatorPageLayout";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { Heading, PrimaryButton } from "../../components/Atoms";
import { CenterSpaced } from "../../components/Layouts";
import { COLORS } from "../../colors";

const CenterAlignContainer = styled.div`
  display: flex;
  justify-content: center;
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
      <CenterSpaced stacked={true}>
        <Heading>Create a game</Heading>
        <PrimaryButton onClick={() => startNewGame()}>
          Start new game
        </PrimaryButton>
      </CenterSpaced>
      <PrimaryButton
        style={{
          position: "absolute",
          display: "block",
          bottom: 0,
          backgroundColor: "#f2d585",
          color: "#bfaf7e",
        }}
        onClick={() => startNewGame("native")}
      >
        Start new mobile game 🤫
      </PrimaryButton>
    </SpectatorPageLayout>
  );
}

export default Page;
