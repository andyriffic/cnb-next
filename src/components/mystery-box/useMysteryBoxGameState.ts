import { MysteryBoxGameView } from "../../services/mystery-box/types";

export type MysteryBoxGameState =
  | "game-over"
  | "waiting-for-players-to-select-box"
  | "waiting-to-show-box-selections"
  | "show-player-box-selections"
  | "revealing-box";

export type MysteryBoxUIState = {
  gameState: MysteryBoxGameState;
  displayBoxId?: number;
};

export function useMysteryBoxGameState(
  game: MysteryBoxGameView
): MysteryBoxUIState {
  return {
    gameState: "show-player-box-selections",
  };
}
