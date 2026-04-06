import { useCallback, useEffect, useState } from "react";
import { MysteryBoxGameView } from "../../services/mystery-box/types";
import { useSound } from "../hooks/useSound";

export enum MysteryBoxGameState {
  WAITING_FOR_PLAYERS_TO_SELECT_BOX = 0,
  WAITING_TO_SHOW_BOX_SELECTION = 1,
  SHOW_PLAYER_BOX_SELECTIONS = 2,
  SHOW_BOMB_DROPPER = 4,
  REVEALING_BOXES = 5,
  SHOW_BOX_REVEAL_RESULT = 6,
  ROUND_OVER = 7,
  GAME_OVER = 8,
}

export type MysteryBoxUIState = {
  gameState: MysteryBoxGameState;
  boxesOpen: boolean;
  finishedShowingBoxDropper: () => void;
};

export function useMysteryBoxGameState(
  game: MysteryBoxGameView,
  bombDropperFeatureEnabled = false,
): MysteryBoxUIState {
  const [gameState, setGameState] = useState(
    initialiseGameStatusToGameState(game),
  );

  const finishedShowingBoxDropper = useCallback(() => {
    console.log("finished showing box dropper");
    setGameState(MysteryBoxGameState.SHOW_BOX_REVEAL_RESULT);
  }, []);

  useEffect(() => {
    if (
      gameState === MysteryBoxGameState.WAITING_FOR_PLAYERS_TO_SELECT_BOX &&
      game.currentRound.status === "ready"
    ) {
      const timeout = setTimeout(() => {
        setGameState(MysteryBoxGameState.SHOW_PLAYER_BOX_SELECTIONS);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [gameState, game]);

  useEffect(() => {
    if (!bombDropperFeatureEnabled) {
      if (gameState === MysteryBoxGameState.SHOW_PLAYER_BOX_SELECTIONS) {
        const timeout = setTimeout(() => {
          console.log("dropper disabled, skipping bomb dropper");

          setGameState(MysteryBoxGameState.REVEALING_BOXES);
        }, 1000);

        return () => clearTimeout(timeout);
      }
    }

    if (gameState === MysteryBoxGameState.SHOW_PLAYER_BOX_SELECTIONS) {
      const timeout = setTimeout(() => {
        if (
          game.currentRound.boxes.every((box) => box.contents.type !== "bomb")
        ) {
          console.log("dropper enabled, no bomb boxes");
          setGameState(MysteryBoxGameState.REVEALING_BOXES);
        } else {
          console.log("dropper enabled, showing dropper");

          setGameState(MysteryBoxGameState.SHOW_BOMB_DROPPER);
        }
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [bombDropperFeatureEnabled, game.currentRound.boxes, gameState]);

  useEffect(() => {
    if (gameState === MysteryBoxGameState.REVEALING_BOXES) {
      const timeout = setTimeout(() => {
        setGameState(MysteryBoxGameState.SHOW_BOX_REVEAL_RESULT);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === MysteryBoxGameState.SHOW_BOX_REVEAL_RESULT) {
      if (game.gameOverSummary) {
        setTimeout(() => {
          setGameState(MysteryBoxGameState.GAME_OVER);
        }, 5000);
      } else {
        setTimeout(() => {
          setGameState(MysteryBoxGameState.ROUND_OVER);
        }, 5000);
      }
    }
  }, [game.gameOverSummary, gameState]);

  useEffect(() => {
    if (game.currentRound.status === "in-progress") {
      setGameState(MysteryBoxGameState.WAITING_FOR_PLAYERS_TO_SELECT_BOX);
    }
  }, [gameState, game]);

  return {
    gameState,
    boxesOpen: gameState >= MysteryBoxGameState.REVEALING_BOXES,
    finishedShowingBoxDropper,
  };
}

function initialiseGameStatusToGameState(
  game: MysteryBoxGameView,
): MysteryBoxGameState {
  if (game.currentRound.status === "in-progress") {
    return MysteryBoxGameState.WAITING_FOR_PLAYERS_TO_SELECT_BOX;
  }

  if (!!game.gameOverSummary) {
    return MysteryBoxGameState.GAME_OVER;
  }

  return MysteryBoxGameState.ROUND_OVER;
}
