import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { Heading, PrimaryButton } from "../../../components/Atoms";
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

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { game, resolveRound, newRound, currentRound } = useRPSGame(gameId);
  const { bettingGame, currentBettingRound } = useBettingGame(gameId);
  useSyncRockPapersScissorsWithBettingGame(gameId);
  const gameState = useGameState(game);

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

    const bettingRound = bettingGame.rounds[bettingGame.rounds.length - 1]!;

    const everyoneHasBet =
      bettingRound.playerBets.length ===
      bettingGame.playerWallets.filter((w) => w.value > 0).length;

    return everyoneHasBet;
  }, [bettingGame]);

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
      {game && currentRound && currentBettingRound ? (
        <div>
          <div>
            <button onClick={() => newRound()}>NEW ROUND</button>
          </div>
          {gameState <= RpsGameState.PLAYERS_READY && (
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
          )}
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
                groupBettingRound={currentBettingRound}
                wallets={bettingGame.playerWallets}
                betId="draw"
                direction="right"
                explodeLosers={gameState >= RpsGameState.REMOVE_BUSTED_PLAYERS}
              />
            </Positioned>
          )}
          {bettingGame && (
            <Positioned horizontalAlign={{ align: "center", topPercent: 5 }}>
              <GameStatusAnnouncement
                gameState={gameState}
                groupBettingGame={bettingGame}
                rpsGame={game}
              />
            </Positioned>
          )}
        </div>
      ) : (
        <h2>{gameId} not found</h2>
      )}
      {bettingGame && currentBettingRound ? (
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
                bettingRound={currentBettingRound}
                revealResult={gameState >= RpsGameState.SHOW_BET_RESULT}
                removeBustedPlayers={
                  gameState >= RpsGameState.REMOVE_BUSTED_PLAYERS
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
