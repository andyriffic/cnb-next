import { useEffect } from "react";
import {
  RPSMoveName,
  RPSSpectatorRoundView,
} from "../../services/rock-paper-scissors/types";
import { Appear } from "../animations/Appear";
import { Attention } from "../animations/Attention";
import { FeatureEmoji } from "../Atoms";
import { FlipX } from "../FlipX";
import { useSound } from "../hooks/useSound";
import { FacingDirection } from "../PlayerAvatar";

type Props = {
  playerId: string;
  currentRound: RPSSpectatorRoundView;
  reveal: boolean;
  facingDirection: FacingDirection;
};

export const getMoveEmoji = (moveName: RPSMoveName): string => {
  switch (moveName) {
    case "rock":
      return "🪨";
    case "paper":
      return "📄";
    case "scissors":
      return "✂️";
  }
};

export const ViewerPlayersMove = ({
  playerId,
  currentRound,
  reveal,
  facingDirection,
}: Props): JSX.Element => {
  // const score = game.scores.find((s) => s.playerId === pid)!;
  const { play } = useSound();
  const hasMoved = currentRound.movedPlayerIds.includes(playerId);
  const visibleMove = currentRound.result?.moves.find(
    (m) => m.playerId === playerId
  );
  const didWin = currentRound.result?.winningPlayerId === playerId;
  const isDraw = currentRound.result?.draw;

  useEffect(() => {
    if (reveal) {
      play("rps-show-move");
    }
  }, [reveal, play]);

  // const favorableBets = currentBettingRound?.playerBets.filter(
  //   (b) => b.betOptionId === pid
  // );
  return (
    <FeatureEmoji
      style={{
        textAlign: "center",
      }}
    >
      {visibleMove && reveal ? (
        <Appear
          animation={
            facingDirection === "left" ? "roll-in-right" : "roll-in-left"
          }
        >
          {getMoveEmoji(visibleMove.moveName)}
        </Appear>
      ) : hasMoved ? (
        <FlipX flip={facingDirection === "left"}>👍</FlipX>
      ) : (
        <Attention>😪</Attention>
      )}
    </FeatureEmoji>
  );
};
