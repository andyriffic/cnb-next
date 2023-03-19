import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Card, Heading } from "../../../components/Atoms";
import { useSound } from "../../../components/hooks/useSound";
import { useSyncRockPapersScissorsWithBettingGame } from "../../../components/hooks/useSyncRockPaperScissorsWithBettingGame";
import { Positioned } from "../../../components/Positioned";
import { DebugPlayerBets } from "../../../components/rock-paper-scissors/DebugPlayerBets";
import { DebugPlayerMove } from "../../../components/rock-paper-scissors/DebugPlayerMove";
import { GameStatusAnnouncement } from "../../../components/rock-paper-scissors/GameStatusAnnouncement";
import { useGameFinalPoints } from "../../../components/rock-paper-scissors/hooks/useGameFinalPoints";
import {
  RpsGameState,
  useGameState,
} from "../../../components/rock-paper-scissors/hooks/useGameState";
import { useGameWinningConditions } from "../../../components/rock-paper-scissors/hooks/useGameWinningConditions";
import { RPSGameSubject } from "../../../components/rock-paper-scissors/observers";
import { PointsAwardCeremony } from "../../../components/rock-paper-scissors/PointsAwardCeremony";
import { ViewerPlayer } from "../../../components/rock-paper-scissors/ViewerPlayer";
import { ViewerPlayerBets } from "../../../components/rock-paper-scissors/ViewerPlayerBets";
import { ViewerWaitingToBetList } from "../../../components/rock-paper-scissors/ViewerWaitingToBetList";
import { SpectatorPageLayout } from "../../../components/SpectatorPageLayout";
import { SplashContent } from "../../../components/SplashContent";
import { useBettingGame } from "../../../providers/SocketIoProvider/useGroupBetting";
import { useRPSGame } from "../../../providers/SocketIoProvider/useRockPaperScissorsSocket";
import { roundReady as gameRoundReady } from "../../../services/rock-paper-scissors/helpers";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { game, resolveRound, newRound } = useRPSGame(gameId);
  const { bettingGame } = useBettingGame(gameId);
  useSyncRockPapersScissorsWithBettingGame(gameId);
  const gameState = useGameState(game, bettingGame);
  const winningConditions = useGameWinningConditions(game, bettingGame);
  const gameFinalPoints = useGameFinalPoints(
    game,
    bettingGame,
    winningConditions
  );
  const { play, loop } = useSound();

  useEffect(() => {
    if (gameState.state === RpsGameState.WAITING) {
      const waitingMusic = loop("rps-waiting-music");
      const timeout = setTimeout(() => {
        waitingMusic.play();
      }, 2000);
      return () => {
        waitingMusic.stop();
        clearTimeout(timeout);
      };
    }
  }, [gameState.state, loop]);

  const showPointsCeremony = useMemo(() => {
    if (gameState.state === RpsGameState.FINISHED && !!gameFinalPoints) {
      return true;
    }
    return false;
  }, [gameState.state, gameFinalPoints]);

  const gamePlayersReady = useMemo(() => {
    if (!game) {
      return false;
    }

    return gameRoundReady(game);
  }, [game]);

  const allPlayerHaveBet = useMemo(() => {
    if (!bettingGame) {
      return false;
    }

    const bettingRound = bettingGame.currentRound;

    const everyoneHasBet =
      bettingRound.playerBets.length === bettingGame.playerWallets.length;

    return everyoneHasBet;
  }, [bettingGame]);

  useEffect(() => {
    game && RPSGameSubject.notify(game);
  }, [game]);

  useEffect(() => {
    if (
      gameState.state === RpsGameState.FINISHED &&
      winningConditions &&
      !winningConditions.gameOver
    ) {
      newRound();
    }
  }, [gameState, winningConditions, newRound]);

  useEffect(() => {
    if (
      gameState.state === RpsGameState.READY_TO_PLAY &&
      allPlayerHaveBet &&
      gamePlayersReady
    ) {
      resolveRound();
    }
  }, [gameState, gamePlayersReady, allPlayerHaveBet, resolveRound]);

  const playRoundStartSound = useCallback(() => {
    return play("rps-new-round");
  }, [play]);

  const playGameOnSound = useCallback(() => {
    return play("rps-game-on");
  }, [play]);

  return (
    <SpectatorPageLayout
      debug={
        game &&
        bettingGame && (
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => newRound()}>New Round</button>
            <DebugPlayerMove game={game} />
            <DebugPlayerBets bettingGame={bettingGame} />
          </div>
        )
      }
    >
      {/* <Heading>
        Game: {gameId} | {RpsGameState[gameState.state]}
      </Heading> */}
      {game && showPointsCeremony && gameFinalPoints && (
        <PointsAwardCeremony gameId={game.id} gamePoints={gameFinalPoints} />
      )}
      {!showPointsCeremony && game && bettingGame?.currentRound && (
        <div>
          <Positioned absolute={{ topPercent: 5, leftPercent: 10 }}>
            <ViewerPlayer
              playerId={game.playerIds[0]}
              game={game}
              bettingGame={bettingGame}
              direction="right"
              gameState={gameState.state}
            />
          </Positioned>
          <Positioned absolute={{ topPercent: 5, rightPercent: 10 }}>
            <ViewerPlayer
              playerId={game.playerIds[1]}
              game={game}
              bettingGame={bettingGame}
              direction="left"
              gameState={gameState.state}
            />
          </Positioned>

          {bettingGame && gameState.state >= RpsGameState.SHOW_BETS && (
            <Positioned horizontalAlign={{ align: "center", topPercent: 5 }}>
              <ViewerPlayerBets
                groupBettingRound={bettingGame.currentRound}
                wallets={bettingGame.playerWallets}
                betId="draw"
                direction="right"
                explodeLosers={
                  gameState.state >= RpsGameState.HIGHLIGHT_WINNING_SPECTATORS
                }
              />
            </Positioned>
          )}
          {bettingGame && (
            <GameStatusAnnouncement
              winningConditions={winningConditions}
              gameState={gameState.state}
            />
          )}
          {gameState.state === RpsGameState.WAITING && (
            <SplashContent
              showForMilliseconds={400}
              onShowEffect={playRoundStartSound}
            >
              <Card>
                <Heading>Round {game.roundHistory.length + 1}</Heading>
              </Card>
            </SplashContent>
          )}
          {gameState.state === RpsGameState.HAS_RESULT && (
            <SplashContent
              showForMilliseconds={300}
              onShowEffect={playGameOnSound}
            >
              <Card>
                <Heading>Game on!</Heading>
              </Card>
            </SplashContent>
          )}
        </div>
      )}
      {!showPointsCeremony && bettingGame && (
        <Positioned horizontalAlign={{ align: "center", bottomPercent: 30 }}>
          <div>
            {gameState.state < RpsGameState.HAS_RESULT && !allPlayerHaveBet && (
              <Heading style={{ textAlign: "center" }}>
                Make your choice
              </Heading>
            )}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ViewerWaitingToBetList
                wallets={bettingGame.playerWallets}
                bettingRound={bettingGame.currentRound}
                revealResult={false}
                removeBustedPlayers={
                  gameState.state >= RpsGameState.HIGHLIGHT_WINNING_SPECTATORS
                }
              />
            </div>
          </div>
        </Positioned>
      )}
    </SpectatorPageLayout>
  );
}

export default Page;
