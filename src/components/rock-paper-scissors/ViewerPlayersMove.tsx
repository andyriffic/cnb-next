import { useMemo } from "react";
import styled from "styled-components";
import {
  RPSGame,
  RPSMoveName,
  RPSPlayerMove,
  RPSSpectatorGameView,
  RPSSpectatorRoundView,
} from "../../services/rock-paper-scissors/types";
import {
  CaptionText,
  Card,
  FeatureEmoji,
  Heading,
  PrimaryButton,
  SubHeading,
} from "../Atoms";
import { EvenlySpaced } from "../Layouts";

type Props = {
  playerId: string;
  currentRound: RPSSpectatorRoundView;
};

const getMoveEmoji = (moveName: RPSMoveName): string => {
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
}: Props): JSX.Element => {
  // const score = game.scores.find((s) => s.playerId === pid)!;
  const hasMoved = currentRound.movedPlayerIds.includes(playerId);
  const visibleMove = currentRound.result?.moves.find(
    (m) => m.playerId === playerId
  );
  const didWin = currentRound.result?.winningPlayerId === playerId;
  const isDraw = currentRound.result?.draw;

  // const favorableBets = currentBettingRound?.playerBets.filter(
  //   (b) => b.betOptionId === pid
  // );
  return (
    <FeatureEmoji
      style={{
        textAlign: "center",
      }}
    >
      {visibleMove
        ? getMoveEmoji(visibleMove.moveName)
        : hasMoved
        ? "👍"
        : "😪"}
    </FeatureEmoji>
  );
};
