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
      const waitingMusic = loop(
        game.individualMode
          ? "mystery-box-waiting-to-select-bonus-music"
          : "mystery-box-waiting-to-select-box-music"
      );
      waitingMusic.play();
      return () => {
        waitingMusic.stop();
      };
    }
  }, [game.individualMode, gameState, loop]);

  useEffect(() => {
    if (gameState === MysteryBoxGameState.SHOW_PLAYER_BOX_SELECTIONS) {
      play("mystery-box-move-players-to-boxes");
    }
  }, [gameState, play]);

  useEffect(() => {
    if (gameState === MysteryBoxGameState.SHOW_BOX_REVEAL_RESULT) {
      if (
        game.currentRound.boxes.find((box) => box.contents.type === "bomb")
          ?.playerIds.length ||
        0 > 0
      ) {
        setTimeout(() => {
          play("mystery-box-player-explode");
        }, 2000);
      } else {
        setTimeout(() => {
          play("mystery-box-everyone-survives-round");
        }, 2000);
      }
    }
  }, [game.currentRound.boxes, gameState, play]);
}
