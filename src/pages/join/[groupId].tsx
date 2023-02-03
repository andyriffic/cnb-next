import { useRouter } from "next/router";
import { useMemo } from "react";
import styled from "styled-components";
import { Appear } from "../../components/animations/Appear";
import { Heading, PrimaryButton, SubHeading } from "../../components/Atoms";
import { DebugPlayerJoin } from "../../components/DebugPlayerJoin";
import { CenterSpaced } from "../../components/Layouts";
import { PlayerAvatar } from "../../components/PlayerAvatar";
import { SpectatorPageLayout } from "../../components/SpectatorPageLayout";
import { usePlayerNames } from "../../providers/PlayerNamesProvider";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { PlayerWallet } from "../../services/betting/types";

const JoinedPlayerContainer = styled.div`
  display: flex;
  justify-content: center;
  max-width: 90vw;
  flex-wrap: wrap;
`;

const JoinedPlayerItem = styled.div``;

function Page() {
  const router = useRouter();
  const { groupJoin, rockPaperScissors, groupBetting } = useSocketIo();
  const { getName } = usePlayerNames();
  const groupId = router.query.groupId as string;

  const group = useMemo(() => {
    return groupJoin.playerGroups.find((g) => g.id === groupId);
  }, [groupJoin.playerGroups, groupId]);

  return (
    <SpectatorPageLayout debug={group && <DebugPlayerJoin group={group} />}>
      <SubHeading>Join Code:</SubHeading>
      <Heading>{groupId}</Heading>
      {!group && "Invalid group 😭"}
      {group && (
        <CenterSpaced stacked={true}>
          <Heading>Joined players ({group.playerIds.length})</Heading>
          <JoinedPlayerContainer>
            {group.playerIds.map((pid) => (
              <JoinedPlayerItem key={pid}>
                <Appear animation="flip-in">
                  <PlayerAvatar playerId={pid} size="small" />
                </Appear>
              </JoinedPlayerItem>
            ))}
          </JoinedPlayerContainer>
          <PrimaryButton
            disabled={group.playerIds.length < 2}
            onClick={() => {
              const playerId1 = group.playerIds[0]!;
              const playerId2 = group.playerIds[1]!;

              const bettingPlayerWallets = group.playerIds
                .filter((pid) => pid !== playerId1 && pid !== playerId2)
                .map<PlayerWallet>((pid) => ({ playerId: pid, value: 2 }));

              rockPaperScissors.createRPSGame(
                {
                  id: group.id,
                  playerIds: [playerId1, playerId2],
                },
                (gameId) => {
                  groupBetting.createGroupBettingGame(
                    gameId,
                    [
                      { id: playerId1, name: getName(playerId1), odds: 0 },
                      { id: "draw", name: "Draw", odds: 0 },
                      { id: playerId2, name: getName(playerId2), odds: 0 },
                    ],
                    bettingPlayerWallets,
                    (bettingId) =>
                      router.push(`/watch/rock-paper-scissors/${gameId}`)
                  );
                }
              );
            }}
          >
            Start Game
          </PrimaryButton>
        </CenterSpaced>
      )}
    </SpectatorPageLayout>
  );
}

export default Page;
