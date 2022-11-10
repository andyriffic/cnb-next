import Link from "next/link";
import { useMemo } from "react";
import {
  RPSGame,
  RPSPlayerMove,
  RPSRound,
  RPSSpectatorRoundView,
} from "../../services/games/rock-paper-scissors/types";

type Props = {
  playerId: string;
  makeMove: (move: RPSPlayerMove) => void;
  currentRound: RPSSpectatorRoundView;
};

export const PlayerGameCurrentRound = ({
  currentRound,
  playerId,
  makeMove,
}: Props): JSX.Element | null => {
  const hasMoved = useMemo(() => {
    return currentRound.movedPlayerIds.includes(playerId);
  }, [currentRound, playerId]);

  const currentResult = useMemo(() => {
    return currentRound.result;
  }, [currentRound]);

  if (currentResult) {
    return (
      <div>
        {currentResult.draw
          ? "Draw 😅"
          : currentResult.winningPlayerId === playerId
          ? "Won 🎉"
          : "Lost 😭"}
      </div>
    );
  }

  return hasMoved ? (
    <h3>Moved...</h3>
  ) : (
    <div>
      <button onClick={() => makeMove({ playerId, moveName: "rock" })}>
        Rock
      </button>
      <button onClick={() => makeMove({ playerId, moveName: "paper" })}>
        Paper
      </button>
      <button onClick={() => makeMove({ playerId, moveName: "scissors" })}>
        Scissors
      </button>
    </div>
  );
};
