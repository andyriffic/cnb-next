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

  useEffect(() => {
    if (gameState === NUMBER_CRUNCH_GAME_STATE.LATEST_ROUND_REVEALED) {
      if (
        gameView.currentRound.playerGuesses.some(
          (guess) => guess.bucketRangeIndex === 0
        )
      ) {
        play("number-crunch-player-gusssed-number");
      } else if (
        gameView.currentRound.playerGuesses.some(
          (guess) =>
            guess.bucketRangeIndex === 1 || guess.bucketRangeIndex === 2
        )
      ) {
        play("number-crunch-player-guessed-close");
      } else {
        play("number-crunch-player-guessed-far");
      }
    }
  }, [gameState, gameView.currentRound.playerGuesses, loop, play]);
};
