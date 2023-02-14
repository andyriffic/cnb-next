import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import styled from "styled-components";
import {
  CaptionText,
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
  flex-direction: column;
`;

const FIXED_BET_VALUE = 0;

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
      bettingGame.currentRound.playerBets.find((b) => b.playerId === playerId)
    );
  }, [bettingGame, playerId]);

  return (
    <PlayerPageLayout playerId={playerId}>
      {bettingGame && (
        <>
          <Heading style={{ marginBottom: "1rem" }}>
            Round {bettingGame.roundHistory.length + 1}
          </Heading>
          {/* {playerWallet && (
            <Card>
              <SubHeading>Correct guesses</SubHeading>
              <Heading>{playerWallet.value}</Heading>
            </Card>
          )} */}
          {!lockedInBet && playerWallet && (
            <>
              <SubHeading style={{ marginBottom: "1rem" }}>
                Make your choice
              </SubHeading>
              <BettingOptionContainer>
                {bettingGame.currentRound.bettingOptions.map((option) => (
                  <PrimaryButton
                    key={option.id}
                    onClick={() =>
                      makePlayerBet({
                        playerId,
                        betOptionId: option.id,
                        betValue: FIXED_BET_VALUE,
                      })
                    }
                  >
                    {option.name}
                  </PrimaryButton>
                ))}
              </BettingOptionContainer>
            </>
          )}

          {lockedInBet && (
            <Card>
              <CaptionText>You chose</CaptionText>
              <Heading>
                {bettingGame.currentRound.bettingOptions.find(
                  (bo) => bo.id === lockedInBet.betOptionId
                )?.name || ""}{" "}
                🤞
              </Heading>
            </Card>
          )}
        </>
      )}
      {/* <h5>
        <Link href={`/play/${playerId}`}>Back to home</Link>
      </h5> */}
    </PlayerPageLayout>
  );
}

export default Page;
