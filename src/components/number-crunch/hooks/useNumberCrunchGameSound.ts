import { useEffect, useState } from "react";
import { NumberCrunchGameView } from "../../../services/number-crunch/types";
import { useSound } from "../../hooks/useSound";
import { useSomethingWhenArraySizeChanges } from "../../hooks/useSomethingWhenArraySizeChanges";
import { NUMBER_CRUNCH_GAME_STATE } from "./useNumberCrunchGameTiming";

export const useNumberCrunchGameSound = (
  gameView: NumberCrunchGameView,
  gameState: NUMBER_CRUNCH_GAME_STATE
): void => {
  const { loop, play } = useSound();

  useSomethingWhenArraySizeChanges(
    gameView.currentRound.playerGuesses,
    () => {
      if (gameState === NUMBER_CRUNCH_GAME_STATE.PLAYERS_GUESSING) {
        play("number-crunch-player-guessed");
      }
    },
    [gameState]
  );

  useEffect(() => {
    if (gameState === NUMBER_CRUNCH_GAME_STATE.PLAYERS_GUESSING) {
      const music = loop("number-crunch-guessing-music");
      music.play();
      return () => {
        music.stop();
      };
    }
  }, [gameState, loop]);
};
