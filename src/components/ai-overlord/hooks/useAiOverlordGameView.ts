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
  allPlayersHavePlayed: boolean;
};

export const useAiOverlordGameView = (
  aiOverlordGame: AiOverlordGame
): AiOverlordGameView => {
  return {
    gameId: aiOverlordGame.gameId,
    currentOpponent: aiOverlordGame.opponents.find(
      (o) => o.playerId === aiOverlordGame.currentOpponentId
    ),
    currentOpponentMove: aiOverlordGame.opponentMoves.find(
      (o) => o.playerId === aiOverlordGame.currentOpponentId
    ),
    remainingOpponents: aiOverlordGame.opponents
      .filter(
        (o) =>
          !aiOverlordGame.aiOverlord.moves
            .map((t) => t.opponentId)
            .includes(o.playerId)
      )
      .filter((o) => o.playerId !== aiOverlordGame.currentOpponentId),
    allPlayersHavePlayed:
      aiOverlordGame.aiOverlord.moves.length ===
      aiOverlordGame.opponents.length,
  };
};
