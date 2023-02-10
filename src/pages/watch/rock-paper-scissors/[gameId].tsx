import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { Card, Heading, PrimaryButton } from "../../../components/Atoms";
import { useSyncRockPapersScissorsWithBettingGame } from "../../../components/hooks/useSyncRockPaperScissorsWithBettingGame";
import { CenterSpaced, EvenlySpaced } from "../../../components/Layouts";
import { RPSGameSubject } from "../../../components/rock-paper-scissors/observers";
import { SpectatorPageLayout } from "../../../components/SpectatorPageLayout";
import { useBettingGame } from "../../../providers/SocketIoProvider/useGroupBetting";
import { useRPSGame } from "../../../providers/SocketIoProvider/useRockPaperScissorsSocket";
import { ViewerWaitingToBetList } from "../../../components/rock-paper-scissors/ViewerWaitingToBetList";
import { roundReady as gameRoundReady } from "../../../services/rock-paper-scissors/helpers";
import { Positioned } from "../../../components/Positioned";
import {
  RpsGameState,
  useGameState,
} from "../../../components/rock-paper-scissors/hooks/useGameState";
import { DebugPlayerMove } from "../../../components/rock-paper-scissors/DebugPlayerMove";
import { DebugPlayerBets } from "../../../components/rock-paper-scissors/DebugPlayerBets";
import { ViewerPlayer } from "../../../components/rock-paper-scissors/ViewerPlayer";
import { Attention } from "../../../components/animations/Attention";
import { BetTotal } from "../../../components/rock-paper-scissors/BetTotal";
import { DrawBetTotal } from "../../../components/rock-paper-scissors/DrawBetTotal";
import { ViewerPlayerBets } from "../../../components/rock-paper-scissors/ViewerPlayerBets";
import { GameStatusAnnouncement } from "../../../components/rock-paper-scissors/GameStatusAnnouncement";
import { useGameWinningConditions } from "../../../components/rock-paper-scissors/hooks/useGameWinningConditions";
import { SplashContent } from "../../../components/SplashContent";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { game, resolveRound, newRound } = useRPSGame(gameId);
  const { bettingGame } = useBettingGame(gameId);
  useSyncRockPapersScissorsWithBettingGame(gameId);
  const gameState = useGameState(game);
  const winningConditions = useGameWinningConditions(game, bettingGame);

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
      gameState === RpsGameState.FINISHED &&
      winningConditions &&
      !winningConditions.gameOver
    ) {
      newRound();
    }
  }, [gameState, winningConditions, newRound]);

  useEffect(() => {
    if (
      gameState === RpsGameState.PLAYERS_READY &&
      allPlayerHaveBet &&
      gamePlayersReady
    ) {
      resolveRound();
    }
  }, [gameState, gamePlayersReady, allPlayerHaveBet, resolveRound]);

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
      {game && bettingGame?.currentRound ? (
        <div style={{ position: "relative" }}>
          {/* {gameState <= RpsGameState.PLAYERS_READY && (
            <Positioned horizontalAlign={{ align: "center", topPercent: 5 }}>
              <CenterSpaced>
                {gamePlayersReady ? (
                  <PrimaryButton
                    disabled={!allPlayerHaveBet}
                    onClick={() => resolveRound()}
                  >
                    Go!
                  </PrimaryButton>
                ) : (
                  <Heading>Waiting for players to move</Heading>
                )}
              </CenterSpaced>
            </Positioned>
          )} */}
          <Positioned absolute={{ topPercent: 5, leftPercent: 10 }}>
            <ViewerPlayer
              playerId={game.playerIds[0]}
              game={game}
              bettingGame={bettingGame}
              direction="right"
              gameState={gameState}
            />
          </Positioned>
          <Positioned absolute={{ topPercent: 5, rightPercent: 10 }}>
            <ViewerPlayer
              playerId={game.playerIds[1]}
              game={game}
              bettingGame={bettingGame}
              direction="left"
              gameState={gameState}
            />
          </Positioned>

          {bettingGame && gameState >= RpsGameState.SHOW_BETS && (
            <Positioned horizontalAlign={{ align: "center", topPercent: 5 }}>
              <ViewerPlayerBets
                groupBettingRound={bettingGame.currentRound}
                wallets={bettingGame.playerWallets}
                betId="draw"
                direction="right"
                explodeLosers={
                  gameState >= RpsGameState.HIGHLIGHT_WINNING_SPECTATORS
                }
              />
            </Positioned>
          )}
          {bettingGame && (
            <Positioned
              horizontalAlign={{ align: "center", bottomPercent: 20 }}
            >
              <GameStatusAnnouncement
                winningConditions={winningConditions}
                gameState={gameState}
              />
            </Positioned>
          )}
          {gameState === RpsGameState.WAITING && (
            <SplashContent>
              <Card>
                <Heading>Round {game.roundHistory.length + 1}</Heading>
              </Card>
            </SplashContent>
          )}
        </div>
      ) : (
        <h2>{gameId} not found</h2>
      )}
      {bettingGame ? (
        <Positioned horizontalAlign={{ align: "center", bottomPercent: 30 }}>
          <div>
            {gameState < RpsGameState.HAS_RESULT && !allPlayerHaveBet && (
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
                  gameState >= RpsGameState.HIGHLIGHT_WINNING_SPECTATORS
                }
              />
            </div>
          </div>
        </Positioned>
      ) : (
        <>
          <h2>No Betting game found</h2>
        </>
      )}
    </SpectatorPageLayout>
  );
}

export default Page;
