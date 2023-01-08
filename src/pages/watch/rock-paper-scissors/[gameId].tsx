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
import { roundReady as gameRoundReady } from "../../../services/rock-paper-scissors/helpers";
import { Positioned } from "../../../components/Positioned";
import { FeatureValue } from "../../../components/FeatureValue";
import {
  RpsGameState,
  useGameState,
} from "../../../components/rock-paper-scissors/hooks/useGameState";
import { Appear } from "../../../components/animations/Appear";
import { BetTotal } from "../../../components/rock-paper-scissors/BetTotal";
import { DebugPlayerMove } from "../../../components/rock-paper-scissors/DebugPlayerMove";
import { DebugPlayerBets } from "../../../components/rock-paper-scissors/DebugPlayerBets";
import { ViewerPlayer } from "../../../components/rock-paper-scissors/ViewerPlayer";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { game, resolveRound, newRound, currentRound } = useRPSGame(gameId);
  const { bettingGame, currentBettingRound } = useBettingGame(gameId);
  useSyncRockPapersScissorsWithBettingGame(gameId);
  const gameState = useGameState(game);

  const roundReady = useMemo(() => {
    if (!(game && bettingGame)) {
      return false;
    }

    const bettingRound = bettingGame.rounds[bettingGame.rounds.length - 1]!;

    const everyoneHasBet =
      bettingRound.playerBets.length === bettingGame.playerWallets.length;

    return gameRoundReady(game) && everyoneHasBet;
  }, [game, bettingGame]);

  useEffect(() => {
    game && RPSGameSubject.notify(game);
  }, [game]);

  return (
    <SpectatorPageLayout
      debug={
        game &&
        bettingGame && (
          <div style={{ display: "flex", gap: "2rem" }}>
            <DebugPlayerMove game={game} />
            <DebugPlayerBets bettingGame={bettingGame} />
          </div>
        )
      }
    >
      <Heading>
        Game: {gameId} | {RpsGameState[gameState]}
      </Heading>
      {game && currentRound ? (
        <div>
          <div>
            <button onClick={() => resolveRound()}>SHOW RESULT</button>
            <button onClick={() => newRound()}>NEW ROUND</button>
          </div>
          {gameState <= RpsGameState.PLAYERS_READY && (
            <Positioned horizontalAlign={{ align: "center", topPercent: 5 }}>
              <CenterSpaced>
                {roundReady ? (
                  <PrimaryButton onClick={() => resolveRound()}>
                    Go!
                  </PrimaryButton>
                ) : (
                  <Heading>Waiting for players to move</Heading>
                )}
              </CenterSpaced>
            </Positioned>
          )}

          <EvenlySpaced>
            <ViewerPlayer
              playerId={game.playerIds[0]}
              game={game}
              bettingGame={bettingGame}
              direction="right"
              gameState={gameState}
            />
            <ViewerPlayer
              playerId={game.playerIds[1]}
              game={game}
              bettingGame={bettingGame}
              direction="left"
              gameState={gameState}
            />
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
            revealResult={gameState >= RpsGameState.SHOW_BET_RESULT}
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
