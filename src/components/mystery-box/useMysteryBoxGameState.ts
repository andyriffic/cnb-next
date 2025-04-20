import { useEffect, useState } from "react";
import { MysteryBoxGameView } from "../../services/mystery-box/types";

export enum MysteryBoxGameState {
  WAITING_FOR_PLAYERS_TO_SELECT_BOX = 0,
  WAITING_TO_SHOW_BOX_SELECTION = 1,
  SHOW_PLAYER_BOX_SELECTIONS = 2,
  REVEALING_BOXES = 3,
  SHOW_BOX_REVEAL_RESULT = 4,
  ROUND_OVER = 5,
  GAME_OVER = 6,
}

export type MysteryBoxUIState = {
  gameState: MysteryBoxGameState;
  boxesOpen: boolean;
};

export function useMysteryBoxGameState(
  game: MysteryBoxGameView
): MysteryBoxUIState {
  const [gameState, setGameState] = useState(
    initialiseGameStatusToGameState(game)
  );

  useEffect(() => {
    if (
      gameState === MysteryBoxGameState.WAITING_FOR_PLAYERS_TO_SELECT_BOX &&
      game.currentRound.status === "ready"
    ) {
      const timeout = setTimeout(() => {
        setGameState(MysteryBoxGameState.SHOW_PLAYER_BOX_SELECTIONS);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [gameState, game]);

  useEffect(() => {
    if (gameState === MysteryBoxGameState.SHOW_PLAYER_BOX_SELECTIONS) {
      const timeout = setTimeout(() => {
        setGameState(MysteryBoxGameState.REVEALING_BOXES);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === MysteryBoxGameState.REVEALING_BOXES) {
      const timeout = setTimeout(() => {
        setGameState(MysteryBoxGameState.SHOW_BOX_REVEAL_RESULT);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [gameState]);

  useEffect(() => {
    if (game.currentRound.status === "in-progress") {
      setGameState(MysteryBoxGameState.WAITING_FOR_PLAYERS_TO_SELECT_BOX);
    }
  }, [gameState, game]);

  return {
    gameState,
    boxesOpen: gameState >= MysteryBoxGameState.REVEALING_BOXES,
  };
}

function initialiseGameStatusToGameState(
  game: MysteryBoxGameView
): MysteryBoxGameState {
  if (game.currentRound.status === "in-progress") {
    return MysteryBoxGameState.WAITING_FOR_PLAYERS_TO_SELECT_BOX;
  }

  if (!!game.winningPlayerIds) {
    return MysteryBoxGameState.GAME_OVER;
  }

  return MysteryBoxGameState.ROUND_OVER;
}
