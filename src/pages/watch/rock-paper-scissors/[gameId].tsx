import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import styled from "styled-components";
import {
  CaptionText,
  Card,
  CenteredCard,
  FeatureEmoji,
  Heading,
  SubHeading,
} from "../../../components/Atoms";
import { useSyncRockPapersScissorsWithBettingGame } from "../../../components/hooks/useSyncRockPaperScissorsWithBettingGame";
import { EvenlySpaced } from "../../../components/Layouts";
import { RPSGameSubject } from "../../../components/rock-paper-scissors/observers";
import { SpectatorPageLayout } from "../../../components/SpectatorPageLayout";
import { useBettingGame } from "../../../providers/SocketIoProvider/useGroupBetting";
import { useRPSGame } from "../../../providers/SocketIoProvider/useRockPaperScissorsSocket";
import { RPSMoveName } from "../../../services/rock-paper-scissors/types";

type Props = {};

const getMoveEmoji = (moveName: RPSMoveName): string => {
  switch (moveName) {
    case "rock":
      return "🪨";
    case "paper":
      return "📄";
    case "scissors":
      return "✂️";
  }
};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { game, makeMove, resolveRound, newRound, currentRound } =
    useRPSGame(gameId);
  const { bettingGame, currentBettingRound } = useBettingGame(gameId);
  useSyncRockPapersScissorsWithBettingGame(gameId);

  useEffect(() => {
    game && RPSGameSubject.notify(game);
  }, [game]);

  return (
    <SpectatorPageLayout>
      <Heading>Game: {gameId}</Heading>
      {game && currentRound ? (
        <div>
          <div>
            <button onClick={() => resolveRound()}>RESOLVE</button>
            <button onClick={() => newRound()}>NEW ROUND</button>
          </div>

          <EvenlySpaced>
            {game.playerIds.map((pid) => {
              const score = game.scores.find((s) => s.playerId === pid)!;
              const hasMoved = currentRound.movedPlayerIds.includes(pid);
              const visibleMove = currentRound.result?.moves.find(
                (m) => m.playerId === pid
              );
              const didWin = currentRound.result?.winningPlayerId === pid;
              const isDraw = currentRound.result?.draw;

              const favorableBets = currentBettingRound?.playerBets.filter(
                (b) => b.betOptionId === pid
              );
              return (
                <EvenlySpaced key={pid} style={{ gap: "0.4rem" }}>
                  <Card
                    style={{
                      backgroundColor: didWin || isDraw ? "#3CAE85" : "",
                      minWidth: "20vw",
                    }}
                  >
                    <Heading
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {pid}
                    </Heading>
                    <FeatureEmoji
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {visibleMove
                        ? getMoveEmoji(visibleMove.moveName)
                        : hasMoved
                        ? "👍"
                        : "😪"}
                    </FeatureEmoji>
                    <CaptionText style={{ textAlign: "center" }}>
                      Score: {score.score}
                    </CaptionText>
                  </Card>
                  {favorableBets && favorableBets.length > 0 && (
                    <Card>
                      {favorableBets.map((bet) => (
                        <div key={bet.playerId}>{bet.playerId}</div>
                      ))}
                    </Card>
                  )}
                </EvenlySpaced>
              );
            })}
          </EvenlySpaced>

          {/* <div>
            {game.playerIds.map((pid) => (
              <div key={pid}>
                <p>{pid}</p>
                <div>
                  <button
                    onClick={() =>
                      makeMove({ playerId: pid, moveName: "rock" })
                    }
                  >
                    Rock
                  </button>
                  <button
                    onClick={() =>
                      makeMove({ playerId: pid, moveName: "paper" })
                    }
                  >
                    Paper
                  </button>
                  <button
                    onClick={() =>
                      makeMove({ playerId: pid, moveName: "scissors" })
                    }
                  >
                    Scissors
                  </button>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      ) : (
        <h2>{gameId} not found</h2>
      )}
      {bettingGame && currentBettingRound ? (
        <div>
          <Heading>Bets</Heading>
          <EvenlySpaced>
            {bettingGame.playerWallets.map((wallet) => {
              const currentBet = currentBettingRound.playerBets.find(
                (b) => b.playerId === wallet.playerId
              );
              const currentResult =
                currentBettingRound!.result?.playerResults.find(
                  (r) => r.playerId === wallet.playerId
                );
              return (
                <CenteredCard
                  key={wallet.playerId}
                  style={{
                    backgroundColor:
                      wallet.value === 0
                        ? "#E5D2E0"
                        : currentResult && currentResult.totalWinnings > 0
                        ? "#3CAE85"
                        : "",
                  }}
                >
                  <SubHeading>{wallet.playerId}</SubHeading>
                  <Heading>
                    {wallet.value === 0 ? "😩" : `${wallet.value}🍒`}
                  </Heading>
                  <CaptionText>
                    {wallet.value === 0
                      ? "Broke"
                      : currentBet && currentBet.betOptionId}
                    {currentBet && <> ({currentBet.betValue})</>}
                  </CaptionText>
                </CenteredCard>
              );
            })}
          </EvenlySpaced>
          {/* <button onClick={() => resolveBettingRound("draw")}>DRAW</button> */}
          {/* <SubHeading>Wallets 💰</SubHeading>
          {bettingGame.playerWallets.map((wallet) => (
            <div key={wallet.playerId}>
              {wallet.playerId}: {wallet.value}
            </div>
          ))}
          <SubHeading>Betting 💰</SubHeading>
          {bettingGame.rounds.map((betRound) => (
            <div key={betRound.index}>
              <h3>
                Round {betRound.index}: Betting options:{" "}
                {JSON.stringify(betRound.bettingOptions)}
              </h3>
              <SubHeading>Player Bets 💰</SubHeading>
              {betRound.playerBets.map((playerBet) => (
                <div key={playerBet.playerId}>
                  {playerBet.playerId} bet {playerBet.betValue} on{" "}
                  {playerBet.betOptionId}
                </div>
              ))}
              <SubHeading>Betting Result</SubHeading>
              {betRound.result && (
                <h3>RESULT: {betRound.result.winningOptionId}</h3>
              )}
              {betRound.result &&
                betRound.result.playerResults.map((result) => (
                  <div key={result.playerId}>
                    {result.playerId} {result.totalWinnings > 0 ? "+" : ""}
                    {result.totalWinnings}
                  </div>
                ))}
            </div>
          ))} */}
        </div>
      ) : (
        <>
          <h2>No Betting game found</h2>
        </>
      )}
    </SpectatorPageLayout>
  );
}

export default Page;
