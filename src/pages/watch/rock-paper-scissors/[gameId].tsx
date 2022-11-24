import { useRouter } from "next/router";
import { useCallback } from "react";
import styled from "styled-components";
import { Heading, SubHeading } from "../../../components/Atoms";
import { useSyncRockPapersScissorsWithBettingGame } from "../../../components/hooks/useSyncRockPaperScissorsWithBettingGame";
import { SpectatorPageLayout } from "../../../components/SpectatorPageLayout";
import { useBettingGame } from "../../../providers/SocketIoProvider/useGroupBetting";
import { useRPSGame } from "../../../providers/SocketIoProvider/useRockPaperScissorsSocket";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { game, makeMove, resolveRound, newRound, currentRound } =
    useRPSGame(gameId);
  const { bettingGame } = useBettingGame(gameId);
  useSyncRockPapersScissorsWithBettingGame(gameId);

  // const resolveGameAndBet = useCallback(() => {
  //   if (!(game && bettingGame && currentRound)) {
  //     return;
  //   }

  //   resolveRound((resolvedRound) => {
  //     const winningOptionId = resolvedRound.result!.draw
  //       ? "draw"
  //       : resolvedRound.result?.winningPlayerId!;
  //     resolveBettingRound(winningOptionId);
  //   });
  // }, [game, bettingGame, currentRound, resolveRound, resolveBettingRound]);

  return (
    <SpectatorPageLayout>
      <Heading>Game: {gameId}</Heading>
      {game ? (
        <>
          <Heading>Players</Heading>
          <SubHeading>{JSON.stringify(game.playerIds)}</SubHeading>
          <Heading>Scores</Heading>
          <SubHeading>{JSON.stringify(game.scores)}</SubHeading>

          <Heading>Rounds</Heading>
          <div>
            <button onClick={() => resolveRound()}>RESOLVE</button>
            <button onClick={newRound}>NEW ROUND</button>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {game.rounds.map((round) => (
              <div key={round.number}>{JSON.stringify(round)}</div>
            ))}
          </div>
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
        </>
      ) : (
        <h2>{gameId} not found</h2>
      )}
      {bettingGame ? (
        <>
          <Heading>Bets</Heading>
          {/* <button onClick={() => resolveBettingRound("draw")}>DRAW</button> */}
          <SubHeading>Wallets 💰</SubHeading>
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
          ))}
        </>
      ) : (
        <>
          <h2>No Betting game found</h2>
        </>
      )}
    </SpectatorPageLayout>
  );
}

export default Page;
