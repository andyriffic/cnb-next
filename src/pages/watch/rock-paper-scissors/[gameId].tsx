import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { CaptionText, Heading, PrimaryButton } from "../../../components/Atoms";
import { useSyncRockPapersScissorsWithBettingGame } from "../../../components/hooks/useSyncRockPaperScissorsWithBettingGame";
import { CenterSpaced, EvenlySpaced } from "../../../components/Layouts";
import { RPSGameSubject } from "../../../components/rock-paper-scissors/observers";
import { ViewerPlayersMove } from "../../../components/rock-paper-scissors/ViewerPlayersMove";
import { SpectatorPageLayout } from "../../../components/SpectatorPageLayout";
import { useBettingGame } from "../../../providers/SocketIoProvider/useGroupBetting";
import { useRPSGame } from "../../../providers/SocketIoProvider/useRockPaperScissorsSocket";
import { ViewerPlayersAvatar } from "../../../components/rock-paper-scissors/ViewerPlayerAvatar";
import { ViewerWaitingToBetList } from "../../../components/rock-paper-scissors/ViewerWaitingToBetList";
import { latestRound } from "../../../services/rock-paper-scissors/helpers";
import { Positioned } from "../../../components/Positioned";
import { FeatureValue } from "../../../components/FeatureValue";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { game, makeMove, resolveRound, newRound, currentRound } =
    useRPSGame(gameId);
  const { bettingGame, currentBettingRound } = useBettingGame(gameId);
  useSyncRockPapersScissorsWithBettingGame(gameId);

  const roundReady = useMemo(() => {
    if (!(game && bettingGame)) {
      return false;
    }

    const gameRound = latestRound(game);
    const bettingRound = bettingGame.rounds[bettingGame.rounds.length - 1]!;

    const bothPlayersReady =
      gameRound.movedPlayerIds.length === game.playerIds.length;

    const everyoneHasBet =
      bettingRound.playerBets.length === bettingGame.playerWallets.length;

    return bothPlayersReady && everyoneHasBet;
  }, [game, bettingGame]);

  useEffect(() => {
    game && RPSGameSubject.notify(game);
  }, [game]);

  return (
    <SpectatorPageLayout>
      <Heading>Game: {gameId}</Heading>
      {game && currentRound ? (
        <div>
          <div>
            <button onClick={() => resolveRound()}>SHOW RESULT</button>
            <button onClick={() => newRound()}>NEW ROUND</button>
          </div>
          <CenterSpaced>
            {roundReady ? (
              <PrimaryButton onClick={() => resolveRound()}>Go!</PrimaryButton>
            ) : (
              <Heading>Waiting for players to move</Heading>
            )}
          </CenterSpaced>

          <EvenlySpaced>
            {game.playerIds.map((pid, index) => {
              const score = game.scores.find((s) => s.playerId === pid)!;
              const didWin = currentRound.result?.winningPlayerId === pid;
              const isDraw = currentRound.result?.draw;

              const favorableBets = currentBettingRound?.playerBets.filter(
                (b) => b.betOptionId === pid
              );

              const totalFavorableBetValue =
                favorableBets
                  ?.map((b) => b.betValue)
                  .reduce((acc, val) => acc + val, 0) || 0;

              return (
                <EvenlySpaced key={pid} style={{ gap: "0.4rem" }}>
                  <div
                    style={{
                      minWidth: "20vw",
                    }}
                  >
                    {didWin && (
                      <CaptionText style={{ position: "absolute" }}>
                        Winner
                      </CaptionText>
                    )}
                    <ViewerPlayersAvatar
                      playerId={pid}
                      size="medium"
                      facing={index === 0 ? "right" : "left"}
                    />
                    <Positioned
                      absolute={{
                        topPercent: 20,
                        leftPercent: index === 0 ? 40 : undefined,
                        rightPercent: index === 0 ? undefined : 40,
                      }}
                    >
                      <ViewerPlayersMove
                        playerId={pid}
                        currentRound={currentRound}
                      />
                    </Positioned>
                    <CaptionText style={{ textAlign: "center" }}>
                      Score: {score.score}
                    </CaptionText>
                  </div>
                  <Positioned
                    absolute={{
                      topPercent: 20,
                      leftPercent: index === 0 ? 1 : undefined,
                      rightPercent: index === 0 ? undefined : 1,
                    }}
                  >
                    <FeatureValue
                      label="Total 🍒"
                      value={totalFavorableBetValue}
                    />
                  </Positioned>

                  {/* {favorableBets && favorableBets.length > 0 && (
                    <Card>
                      {favorableBets.map((bet) => (
                        <div key={bet.playerId}>{bet.playerId}</div>
                      ))}
                    </Card>
                  )} */}
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
          <Heading style={{ textAlign: "center" }}>Bets</Heading>
          <ViewerWaitingToBetList
            wallets={bettingGame.playerWallets}
            bettingRound={currentBettingRound}
          />

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
