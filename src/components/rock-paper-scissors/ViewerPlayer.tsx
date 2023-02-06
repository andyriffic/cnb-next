import { pid } from "process";
import { GroupBettingGame } from "../../services/betting/types";
import { latestRound } from "../../services/rock-paper-scissors/helpers";
import { RPSSpectatorGameView } from "../../services/rock-paper-scissors/types";
import { Attention } from "../animations/Attention";
import { CaptionText, Card, SubHeading } from "../Atoms";
import { EvenlySpaced } from "../Layouts";
import { FacingDirection } from "../PlayerAvatar";
import { Positioned } from "../Positioned";
import { BetTotal } from "./BetTotal";
import { RpsGameState } from "./hooks/useGameState";
import { ViewerPlayersAvatar } from "./ViewerPlayerAvatar";
import { ViewerPlayerBets } from "./ViewerPlayerBets";
import { ViewerPlayersMove } from "./ViewerPlayersMove";

type Props = {
  playerId: string;
  game: RPSSpectatorGameView;
  bettingGame?: GroupBettingGame;
  direction: FacingDirection;
  gameState: RpsGameState;
};
export const ViewerPlayer = ({
  playerId,
  game,
  bettingGame,
  direction,
  gameState,
}: Props): JSX.Element | null => {
  const currentRound = latestRound(game);
  const score = game.scores.find((s) => s.playerId === playerId)!;
  const didWin = currentRound.result?.winningPlayerId === playerId;
  const isDraw = currentRound.result?.draw;

  const totalBetValue =
    bettingGame?.currentRound.playerBets
      .map((b) => b.betValue)
      .reduce((acc, val) => acc + val, 0) || 0;

  const favorableBets = bettingGame?.currentRound.playerBets.filter(
    (b) => b.betOptionId === playerId
  );

  const totalFavorableBetValue =
    favorableBets?.map((b) => b.betValue).reduce((acc, val) => acc + val, 0) ||
    0;

  return (
    <div style={{ position: "relative" }}>
      <ViewerPlayersAvatar
        playerId={playerId}
        size="medium"
        facing={direction}
      />
      <Positioned
        absolute={{
          topPercent: 20,
          leftPercent: direction === "right" ? 25 : undefined,
          rightPercent: direction === "left" ? 25 : undefined,
        }}
      >
        <ViewerPlayersMove
          playerId={playerId}
          currentRound={currentRound}
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
              betId={playerId}
              direction={direction}
              explodeLosers={
                gameState >= RpsGameState.HIGHLIGHT_WINNING_SPECTATORS
              }
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
