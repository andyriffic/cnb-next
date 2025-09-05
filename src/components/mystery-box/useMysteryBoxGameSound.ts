import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { MysteryBoxGameView } from "../../services/mystery-box/types";
import { useSound } from "../hooks/useSound";
import { useSomethingWhenArraySizeChanges } from "../hooks/useSomethingWhenArraySizeChanges";
import { MysteryBoxGameState } from "./useMysteryBoxGameState";

export function useMysteryBoxGameSound(
  game: MysteryBoxGameView,
  gameState: MysteryBoxGameState
): void {
  const playingSounds = useRef<{ [id: string]: Howl }>({});

  const { play, loop } = useSound();

  useSomethingWhenArraySizeChanges(
    game.players.filter((p) => p.status === "selected"),
    () => {
      if (gameState === MysteryBoxGameState.WAITING_FOR_PLAYERS_TO_SELECT_BOX) {
        play("mystery-box-player-select-box");
      }
    },
    [gameState]
  );

  useEffect(() => {
    if (gameState === MysteryBoxGameState.WAITING_FOR_PLAYERS_TO_SELECT_BOX) {
      const waitingMusic = loop("mystery-box-waiting-to-select-box-music");
      waitingMusic.play();
      return () => {
        waitingMusic.stop();
      };
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === MysteryBoxGameState.SHOW_PLAYER_BOX_SELECTIONS) {
      play("mystery-box-move-players-to-boxes");
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === MysteryBoxGameState.SHOW_BOX_REVEAL_RESULT) {
      play("mystery-box-player-select-box");
    }
  }, [gameState]);
}
