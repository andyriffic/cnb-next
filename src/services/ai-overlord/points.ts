import { PlayerGameMoves } from "../save-game-moves/types";
import {
  AiOverlordGame,
  AiOverlordOpponentMoveWithTextAndOutcome,
} from "./types";

const aiMoveOutcomeToPoints = ({
  moves,
  winner,
}: {
  moves: number;
  winner: boolean;
}): ((
  outcome: AiOverlordOpponentMoveWithTextAndOutcome
) => PlayerGameMoves) => {
  return (outcome: AiOverlordOpponentMoveWithTextAndOutcome) => ({
    playerId: outcome.opponentId,
    moves,
    winner,
  });
};

export const finishedAiOverlordGameToPoints = (
  aiOverlordGame: AiOverlordGame
): PlayerGameMoves[] => {
  const winningFinishedOutcomes = aiOverlordGame.aiOverlord.moves.filter(
    (m) => m.outcome === "lose"
  );
  const drawnFinishedOutcomes = aiOverlordGame.aiOverlord.moves.filter(
    (m) => m.outcome === "draw"
  );
  const losingFinishedOutcomes = aiOverlordGame.aiOverlord.moves.filter(
    (m) => m.outcome === "win"
  );

  return [
    ...winningFinishedOutcomes.map(
      aiMoveOutcomeToPoints({
        moves: 4 + winningFinishedOutcomes.length,
        winner: true,
      })
    ),
    ...drawnFinishedOutcomes.map(
      aiMoveOutcomeToPoints({
        moves: 2 + drawnFinishedOutcomes.length,
        winner: false,
      })
    ),
    ...losingFinishedOutcomes.map(
      aiMoveOutcomeToPoints({
        moves: losingFinishedOutcomes.length,
        winner: false,
      })
    ),
  ];
};
