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

  const lockedInBet = useMemo(() => {
    return (
      bettingGame &&
      bettingGame.rounds[bettingGame.rounds.length - 1]?.playerBets.find(
        (b) => b.playerId === playerId
      )
    );
  }, [bettingGame, playerId]);

  const [betValue, setBetValue] = useState(0);

  return (
    <PlayerPageLayout playerId={playerId}>
      {bettingGame && (
        <>
          <Heading>Round {bettingGame.rounds.length}</Heading>
          {playerWallet && (
            <Card>
              <SubHeading>Balance</SubHeading>
              <Heading>{playerWallet.value}🍒</Heading>
            </Card>
          )}
          {!lockedInBet && playerWallet && playerWallet.value > 0 && (
            <>
              <SubHeading>Amount ({betValue}🍒)</SubHeading>
              <fieldset>
                <input
                  type="range"
                  min={0}
                  max={playerWallet.value}
                  step="1"
                  value={betValue}
                  onChange={(e) => setBetValue(e.currentTarget.valueAsNumber)}
                />
              </fieldset>

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
              <PrimaryButton
                disabled={!selectedBetOption || betValue <= 0}
                onClick={() =>
                  makePlayerBet({
                    playerId,
                    betOptionId: selectedBetOption!.id,
                    betValue: betValue,
                  })
                }
              >
                {betValue > 0 && selectedBetOption
                  ? `${betValue}🍒 on ${selectedBetOption.name}`
                  : "Place Bet"}
              </PrimaryButton>
            </>
          )}

          {lockedInBet && (
            <Card>
              <SubHeading>Your bet</SubHeading>
              <p>
                {lockedInBet.betValue}🍒 on {lockedInBet.betOptionId}
              </p>
            </Card>
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
