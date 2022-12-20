import { useRouter } from "next/router";
import { useCallback } from "react";
import styled from "styled-components";
import { SpectatorPageLayout } from "../../components/SpectatorPageLayout";
import { useSocketIo } from "../../providers/SocketIoProvider";

const CenterAlignContainer = styled.div`
  display: flex;
  justify-content: center;
`;

function Page() {
  const router = useRouter();
  const { groupJoin } = useSocketIo();

  const startNewGame = useCallback(() => {
    console.log("Creating New Player Group...");

    groupJoin.createPlayerGroup((groupId) => {
      console.log("Group Created", groupId);
      router.replace(`/join/${groupId}`);
    });
  }, [groupJoin, router]);

  return (
    <SpectatorPageLayout>
      <h1>Create a game</h1>
      <button onClick={startNewGame}>Start new game</button>
    </SpectatorPageLayout>
  );
}

export default Page;
