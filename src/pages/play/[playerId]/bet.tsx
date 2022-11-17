import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import styled from "styled-components";
import { Card, Heading, SubHeading } from "../../../components/Atoms";
import { PlayerPageLayout } from "../../../components/PlayerPageLayout";
import { useBettingGame } from "../../../providers/SocketIoProvider/useGroupBetting";

const BettingOptionContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

function Page() {
  const query = useRouter().query;

  const playerId = query.playerId as string;
  const gameId = query.gameId as string;

  const { bettingGame } = useBettingGame(gameId);
  const playerWallet = useMemo(() => {
    return (
      bettingGame &&
      bettingGame.playerWallets.find((w) => w.playerId === playerId)
    );
  }, [bettingGame, playerId]);

  return (
    <PlayerPageLayout>
      {/* <p>
        {gameId}: {game ? "found" : "not found"}
      </p> */}
      {bettingGame && (
        <>
          <Heading>Round {bettingGame.rounds.length}</Heading>
          {playerWallet && (
            <Card>
              <SubHeading>Balance</SubHeading>
              <Heading>{playerWallet.value}</Heading>
            </Card>
          )}
          <SubHeading>Options</SubHeading>
          <BettingOptionContainer>
            {bettingGame.rounds[0]?.bettingOptions.map((option) => (
              <Card key={option.id}>
                <SubHeading>{option.name}</SubHeading>
                <Heading>{option.odds}:1</Heading>
              </Card>
            ))}
          </BettingOptionContainer>
        </>
      )}
      <h5>
        <Link href={`/play/${playerId}`}>Back to home</Link>
      </h5>
    </PlayerPageLayout>
  );
}

export default Page;
