import { useEffect, useRef } from "react";
import { AiOverlordGame } from "../../../services/ai-overlord/types";
import { useAiOverlordGame } from "../../../providers/SocketIoProvider/useAiOverlord";
import { AiOverlordGameView } from "./useAiOverlordGameView";

export const useAiOverlordGameFlowHelper = (
  aiOverlordGame: AiOverlordGame
): void => {
  const backgroundMovesInProgressPlayerIds = useRef<string[]>([]);
  const { makeRobotMove } = useAiOverlordGame(aiOverlordGame.gameId);

  //Automatically respond to current players move
  // useEffect(() => {
  //   if (
  //     gameView.currentOpponent &&
  //     gameView.currentOpponentMove &&
  //     !isThinking &&
  //     !gameView.currentRobotOpponentMove
  //   ) {
  //     startThinking();
  //     makeRobotMove(gameView.currentOpponent.playerId);
  //   }
  // }, [
  //   gameView.currentOpponent,
  //   gameView.currentOpponentMove,
  //   gameView.currentRobotOpponentMove,
  //   isThinking,
  //   makeRobotMove,
  //   startThinking,
  // ]);

  useEffect(() => {
    console.log("useAiOverlordGameFlowHelper", aiOverlordGame);
    const playerIdsWithAiResponses = aiOverlordGame.aiOverlord.moves.map(
      (m) => m.opponentId
    );
    const waitingPlayerIdsWhoHaveMoved = aiOverlordGame.opponentMoves
      .filter((o) => !playerIdsWithAiResponses.includes(o.playerId))
      .map((o) => o.playerId);

    console.log("waitingPlayerIdsWhoHaveMoved", waitingPlayerIdsWhoHaveMoved);

    const playerIdsForBackgroundAi = waitingPlayerIdsWhoHaveMoved.filter(
      (playerId) =>
        !backgroundMovesInProgressPlayerIds.current.includes(playerId)
    );

    console.log("playerIdsForBackgroundAi", playerIdsForBackgroundAi);

    backgroundMovesInProgressPlayerIds.current = playerIdsForBackgroundAi;
    playerIdsForBackgroundAi.forEach((playerId) => {
      console.log("Making background move for player", playerId);
      makeRobotMove(playerId);
    });
  }, [aiOverlordGame, makeRobotMove]);
};
