import { useReducer } from "react";
import { PacManBoard } from "../../types";
import { Player } from "../../../../types/Player";
import { createInitialState, PacManUiState, reducer } from "./reducer";

export type UsePacMan = {
  uiState: PacManUiState;
  startGame: () => void;
  movePlayer: () => void;
  startMovePacman: () => void;
  movePacmanOneSquare: () => void;
};

export function usePacMan(
  allPlayers: Player[],
  board: PacManBoard,
  team: string | undefined,
  pacmanStartingIndex: number
): UsePacMan {
  const [state, dispatch] = useReducer(
    reducer,
    { allPlayers, board, team, pacmanStartingIndex },
    createInitialState
  );

  return {
    uiState: state,
    movePlayer: () => dispatch({ type: "MOVE_PLAYERS" }),
    startMovePacman: () => dispatch({ type: "START_MOVE_PACMAN" }),
    movePacmanOneSquare: () => dispatch({ type: "MOVE_PACMAN" }),
    startGame: () => dispatch({ type: "RELEASE_PLAYERS_FROM_JAIL" }),
  };
}
