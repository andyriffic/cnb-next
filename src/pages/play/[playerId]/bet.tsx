import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import styled from "styled-components";
import {
  Card,
  Heading,
  PrimaryButton,
  SubHeading,
} from "../../../components/Atoms";
import { PlayerPageLayout } from "../../../components/PlayerPageLayout";
import { useBettingGame } from "../../../providers/SocketIoProvider/useGroupBetting";
import { BettingOption } from "../../../services/betting/types";

const BettingOptionContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

function Page() {
  const query = useRouter().query;

  const playerId = query.playerId as string;
  const gameId = query.gameId as string;

  const { bettingGame, makePlayerBet } = useBettingGame(gameId);
  const playerWallet = useMemo(() => {
    return (
      bettingGame &&
      bettingGame.playerWallets.find((w) => w.playerId === playerId)
    );
  }, [bettingGame, playerId]);
  const [selectedBetOption, setSelectedBetOption] = useState<
    BettingOption | undefined
  >();

  return (
    <PlayerPageLayout>
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
              <button
                key={option.id}
                onClick={() => setSelectedBetOption(option)}
                style={{
                  border:
                    option.id === selectedBetOption?.id
                      ? "2px solid red"
                      : "2px solid black",
                }}
              >
                <Card>
                  <SubHeading>{option.name}</SubHeading>
                  <Heading>{option.odds}:1</Heading>
                </Card>
              </button>
            ))}
          </BettingOptionContainer>
          {playerWallet && playerWallet.value > 0 && (
            <PrimaryButton
              disabled={!selectedBetOption}
              onClick={() =>
                makePlayerBet({
                  playerId,
                  betOptionId: selectedBetOption!.id,
                  betValue: 1,
                })
              }
            >
              Place Bet
            </PrimaryButton>
          )}
        </>
      )}
      <h5>
        <Link href={`/play/${playerId}`}>Back to home</Link>
      </h5>
    </PlayerPageLayout>
  );
}

export default Page;
