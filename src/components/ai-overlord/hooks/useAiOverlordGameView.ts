import {
  AiOverlordGame,
  AiOverlordOpponent,
  AiOverlordOpponentMove,
  AiOverlordOpponentMoveWithTextAndOutcome,
  AiOverlordOpponentResult,
  AiOverlordTaunt,
  TranslatedText,
} from "../../../services/ai-overlord/types";

export type AiOverlordGameView = {
  gameId: string;
  gameStarted: boolean;
  currentOpponent?: AiOverlordOpponent;
  currentOpponentMove?: AiOverlordOpponentMove;
  currentRobotOpponentMove?: AiOverlordOpponentMoveWithTextAndOutcome;
  currentRobotOpponentTaunt?: AiOverlordTaunt;
  remainingOpponents: AiOverlordOpponent[];
  currentOpponentFinished: boolean;
  allPlayersHavePlayed: boolean;
  allPlayersMoved: boolean;
  finalRobotSummary?: TranslatedText;
};

export const useAiOverlordGameView = (
  aiOverlordGame: AiOverlordGame
): AiOverlordGameView => {
  const currentOpponent = aiOverlordGame.opponents.find(
    (o) => o.playerId === aiOverlordGame.currentOpponentId
  );
  return {
    gameId: aiOverlordGame.gameId,
    gameStarted: !!aiOverlordGame.currentOpponentId,
    currentOpponent,
    currentOpponentMove: aiOverlordGame.opponentMoves.find(
      (o) => o.playerId === aiOverlordGame.currentOpponentId
    ),
    currentRobotOpponentTaunt:
      currentOpponent &&
      aiOverlordGame.taunts.find(
        (t) => t.playerId === currentOpponent.playerId
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
    currentOpponentFinished: !!aiOverlordGame.aiOverlord.moves.find(
      (m) => m.opponentId === aiOverlordGame.currentOpponentId
    ),
    allPlayersMoved:
      aiOverlordGame.aiOverlord.moves.length ===
      aiOverlordGame.opponents.length,
    currentRobotOpponentMove: aiOverlordGame.aiOverlord.moves.find(
      (m) => m.opponentId === aiOverlordGame.currentOpponentId
    ),
    finalRobotSummary: aiOverlordGame.aiOverlord.finalSummary,
  };
};
