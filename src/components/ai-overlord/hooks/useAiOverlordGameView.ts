import {
  AiOverlordGame,
  AiOverlordOpponent,
  AiOverlordOpponentMove,
} from "../../../services/ai-overlord/types";

export type AiOverlordGameView = {
  gameId: string;
  currentOpponent?: AiOverlordOpponent;
  currentOpponentMove?: AiOverlordOpponentMove;
  remainingOpponents: AiOverlordOpponent[];
};

export const useAiOverlordGameView = (
  aiOverlordGame: AiOverlordGame
): AiOverlordGameView => {
  const currentOpponentId =
    aiOverlordGame.taunts[aiOverlordGame.taunts.length - 1]?.playerId;

  return {
    gameId: aiOverlordGame.gameId,
    currentOpponent: aiOverlordGame.opponents.find(
      (o) => o.playerId === currentOpponentId
    ),
    currentOpponentMove: aiOverlordGame.opponentMoves.find(
      (o) => o.playerId === currentOpponentId
    ),
    remainingOpponents: aiOverlordGame.opponents
      .filter(
        (o) =>
          !aiOverlordGame.taunts.map((t) => t.playerId).includes(o.playerId)
      )
      .filter((o) => o.playerId !== currentOpponentId),
  };
};
