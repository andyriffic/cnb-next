import Link from "next/link";
import { useMemo } from "react";
import {
  RPSGame,
  RPSPlayerMove,
  RPSRound,
} from "../../services/games/rockPaperScissors/types";

type Props = {
  playerId: string;
  makeMove: (move: RPSPlayerMove) => void;
  currentRound: RPSRound;
};

export const PlayerGameCurrentRound = ({
  currentRound,
  playerId,
  makeMove,
}: Props): JSX.Element | null => {
  const currentMove = useMemo(() => {
    return currentRound.moves.find((move) => move.playerId === playerId);
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

  return currentMove ? (
    <h3>{currentMove.moveName}</h3>
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
