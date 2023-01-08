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
  const currentBettingRound =
    bettingGame?.rounds[bettingGame.rounds.length - 1];
  const score = game.scores.find((s) => s.playerId === playerId)!;
  const didWin = currentRound.result?.winningPlayerId === playerId;
  const isDraw = currentRound.result?.draw;

  const totalBetValue =
    currentBettingRound?.playerBets
      .map((b) => b.betValue)
      .reduce((acc, val) => acc + val, 0) || 0;

  const favorableBets = currentBettingRound?.playerBets.filter(
    (b) => b.betOptionId === playerId
  );

  const totalFavorableBetValue =
    favorableBets?.map((b) => b.betValue).reduce((acc, val) => acc + val, 0) ||
    0;

  return (
    <EvenlySpaced key={pid} style={{ gap: "0.4rem" }}>
      <div
        style={{
          minWidth: "20vw",
        }}
      >
        {gameState >= RpsGameState.SHOW_GAME_RESULT && didWin && (
          <SubHeading style={{ position: "absolute" }}>
            <Attention animate={gameState === RpsGameState.SHOW_GAME_RESULT}>
              Winner 🎉
            </Attention>
          </SubHeading>
        )}
        <ViewerPlayersAvatar
          playerId={playerId}
          size="medium"
          facing={direction}
        />
        <Positioned
          absolute={{
            topPercent: 20,
            leftPercent: direction === "right" ? 40 : undefined,
            rightPercent: direction === "left" ? 40 : undefined,
          }}
        >
          <ViewerPlayersMove
            playerId={playerId}
            currentRound={currentRound}
            reveal={gameState >= RpsGameState.SHOW_MOVES}
            facingDirection={direction}
          />
        </Positioned>
        <CaptionText style={{ textAlign: "center" }}>
          Score: {score.score}
        </CaptionText>
      </div>
      {gameState >= RpsGameState.SHOW_BETS && (
        <Positioned
          absolute={{
            bottomPercent: 55,
            leftPercent: direction === "right" ? 10 : undefined,
            rightPercent: direction === "left" ? 10 : undefined,
          }}
        >
          {/* <Appear
          show={gameState >= RpsGameState.SHOW_BETS}
          animation="flip-in"
        > */}
          {/* <FeatureValue
            label="Total 🍒"
            value={totalFavorableBetValue}
          /> */}
          <BetTotal
            totalBetValue={totalBetValue}
            betValue={totalFavorableBetValue}
          />
          {/* </Appear> */}
        </Positioned>
      )}

      {/* {favorableBets && favorableBets.length > 0 && (
        <Card>
          {favorableBets.map((bet) => (
            <div key={bet.playerId}>{bet.playerId}</div>
          ))}
        </Card>
      )} */}
    </EvenlySpaced>
  );
};
