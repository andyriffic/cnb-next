import { useEffect, useMemo, useRef } from "react";
import { GroupBettingGame } from "../../services/betting/types";
import { RPSSpectatorGameView } from "../../services/rock-paper-scissors/types";
import { Player, getPlayerZombieRunDetails } from "../../types/Player";
import { Card, SubHeading } from "../Atoms";
import { FeatureValue } from "../FeatureValue";
import { ZombieTransform } from "../JoinedPlayer";
import { FacingDirection } from "../PlayerAvatar";
import { Positioned } from "../Positioned";
import { Attention } from "../animations/Attention";
import { useSound } from "../hooks/useSound";
import { ViewerPlayersAvatar } from "./ViewerPlayerAvatar";
import { ViewerPlayerBets } from "./ViewerPlayerBets";
import { ViewerPlayersMove } from "./ViewerPlayersMove";
import { RpsGameState } from "./hooks/useGameState";
import { WinningConditions } from "./hooks/useGameWinningConditions";

type Props = {
  player: Player;
  game: RPSSpectatorGameView;
  bettingGame?: GroupBettingGame;
  direction: FacingDirection;
  gameState: RpsGameState;
  winningConditions: WinningConditions | undefined;
};

const getPlayersScore = (
  playerId: string,
  game: RPSSpectatorGameView
): number => {
  const score = game.scores.find((s) => s.playerId === playerId);
  return score ? score.score : 0;
};

export const ViewerPlayer = ({
  player,
  game,
  bettingGame,
  direction,
  gameState,
  winningConditions,
}: Props): JSX.Element | null => {
  const initialScore = useRef(getPlayersScore(player.id, game));
  const { play } = useSound();

  const displayedScore = useMemo(() => {
    if (gameState >= RpsGameState.SHOW_GAME_RESULT) {
      initialScore.current = getPlayersScore(player.id, game);
    }

    return initialScore.current;
  }, [game, player.id, gameState]);

  useEffect(() => {
    const didWin = game.currentRound.result?.winningPlayerId === player.id;
    const isDraw = game.currentRound.result?.draw;

    if (gameState === RpsGameState.SHOW_GAME_RESULT) {
      if (didWin) {
        play("rps-result-win");
      }
      if (isDraw) {
        play("rps-result-draw"); //This will play 2 draw sounds at the same time since two instances of this component but I don't care at the moment
      }
    }
  }, [gameState, game, player.id, play]);

  const score = game.scores.find((s) => s.playerId === player.id)!;
  const didWin = game.currentRound.result?.winningPlayerId === player.id;
  const isDraw = game.currentRound.result?.draw;

  const totalBetValue =
    bettingGame?.currentRound.playerBets
      .map((b) => b.betValue)
      .reduce((acc, val) => acc + val, 0) || 0;

  const favorableBets = bettingGame?.currentRound.playerBets.filter(
    (b) => b.betOptionId === player.id
  );

  const totalFavorableBetValue =
    favorableBets?.map((b) => b.betValue).reduce((acc, val) => acc + val, 0) ||
    0;

  return (
    <div style={{ position: "relative" }}>
      <ZombieTransform isZombie={getPlayerZombieRunDetails(player).isZombie}>
        <ViewerPlayersAvatar
          playerId={player.id}
          size="medium"
          facing={direction}
        />
      </ZombieTransform>

      <Positioned
        absolute={{
          topPercent: 1,
          leftPercent: direction === "right" ? 1 : undefined,
          rightPercent: direction === "left" ? 1 : undefined,
        }}
      >
        <FeatureValue value={displayedScore} />
      </Positioned>
      <Positioned
        absolute={{
          topPercent: 20,
          leftPercent: direction === "right" ? 25 : undefined,
          rightPercent: direction === "left" ? 25 : undefined,
        }}
      >
        <ViewerPlayersMove
          playerId={player.id}
          currentRound={game.currentRound}
          reveal={gameState >= RpsGameState.SHOW_MOVES}
          facingDirection={direction}
        />
      </Positioned>
      {/* <CaptionText style={{ textAlign: "center" }}>
        Score: {score.score}
      </CaptionText> */}
      {gameState >= RpsGameState.SHOW_BETS && (
        <Positioned
          absolute={{
            bottomPercent: 1,
            leftPercent: direction === "right" ? -5 : undefined,
            rightPercent: direction === "left" ? -5 : undefined,
          }}
        >
          {bettingGame && (
            <ViewerPlayerBets
              groupBettingRound={bettingGame.currentRound}
              wallets={bettingGame.playerWallets}
              betId={player.id}
              direction={direction}
              explodeLosers={
                gameState >= RpsGameState.HIGHLIGHT_WINNING_SPECTATORS
              }
              winningConditions={winningConditions}
            />
          )}
        </Positioned>
      )}
      {gameState >= RpsGameState.SHOW_GAME_RESULT && didWin && (
        <Positioned absolute={{ topPercent: -5, leftPercent: 10 }}>
          <Attention animate={gameState === RpsGameState.SHOW_GAME_RESULT}>
            <Card>
              <SubHeading>Winner 🎉</SubHeading>
            </Card>
          </Attention>
        </Positioned>
      )}

      {/* {favorableBets && favorableBets.length > 0 && (
        <Card>
          {favorableBets.map((bet) => (
            <div key={bet.playerId}>{bet.playerId}</div>
          ))}
        </Card>
      )} */}
    </div>
  );
};
