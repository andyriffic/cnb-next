import { useRouter } from "next/router";
import { useMemo } from "react";
import styled from "styled-components";
import { Heading, PrimaryButton, SubHeading } from "../../components/Atoms";
import { SpectatorPageLayout } from "../../components/SpectatorPageLayout";
import { useSocketIo } from "../../providers/SocketIoProvider";

function Page() {
  const router = useRouter();
  const { groupJoin, rockPaperScissors } = useSocketIo();
  const groupId = router.query.groupId as string;

  const group = useMemo(() => {
    return groupJoin.playerGroups.find((g) => g.id === groupId);
  }, [groupJoin.playerGroups, groupId]);

  return (
    <SpectatorPageLayout>
      <SubHeading>Join Code:</SubHeading>
      <Heading>{groupId}</Heading>
      {group ? "Valid Group 😄" : "Invalid group 😭"}
      {group && (
        <div>
          <Heading>Joined players</Heading>
          <ul>
            {group.playerIds.map((pid) => (
              <li key={pid}>{pid}</li>
            ))}
          </ul>
          <PrimaryButton
            disabled={group.playerIds.length < 2}
            onClick={() => {
              rockPaperScissors.createRPSGame(
                {
                  id: group.id,
                  playerIds: [group.playerIds[0]!, group.playerIds[1]!],
                },
                (gameId) => {
                  router.push(`/watch/rock-paper-scissors/${gameId}`);
                }
              );
            }}
          >
            Start Game
          </PrimaryButton>
        </div>
      )}
    </SpectatorPageLayout>
  );
}

export default Page;
