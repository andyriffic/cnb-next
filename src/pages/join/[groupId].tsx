import { useRouter } from "next/router";
import { useMemo } from "react";
import styled from "styled-components";
import { Heading, PrimaryButton, SubHeading } from "../../components/Atoms";
import { SpectatorPageLayout } from "../../components/SpectatorPageLayout";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { PlayerWallet } from "../../services/betting/types";

function Page() {
  const router = useRouter();
  const { groupJoin, rockPaperScissors, groupBetting } = useSocketIo();
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
              const player1 = group.playerIds[0]!;
              const player2 = group.playerIds[1]!;

              const bettingPlayerWallets = group.playerIds
                .filter((pid) => pid !== player1 && pid !== player2)
                .map<PlayerWallet>((pid) => ({ playerId: pid, value: 2 }));

              rockPaperScissors.createRPSGame(
                {
                  id: group.id,
                  playerIds: [player1, player2],
                },
                (gameId) => {
                  groupBetting.createGroupBettingGame(
                    gameId,
                    [
                      { id: player1, name: player1, odds: 2 },
                      { id: "draw", name: "draw", odds: 3 },
                      { id: player2, name: player2, odds: 2 },
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
        </div>
      )}
    </SpectatorPageLayout>
  );
}

export default Page;
