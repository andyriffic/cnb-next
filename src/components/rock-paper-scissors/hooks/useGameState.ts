import { useEffect, useState } from "react";
import {
  roundHasResult,
  roundReady,
} from "../../../services/rock-paper-scissors/helpers";
import { RPSSpectatorGameView } from "../../../services/rock-paper-scissors/types";

export enum RpsGameState {
  WAITING = 0,
  PLAYERS_READY = 1,
  HAS_RESULT = 2,
  SHOW_BETS = 3,
  SHOW_MOVES = 4,
  SHOW_GAME_RESULT = 5,
  SHOW_BET_RESULT = 6,
  FINISHED = 7,
}

const getGameInitialState = (
  game: RPSSpectatorGameView | undefined
): RpsGameState => {
  if (game && roundReady(game)) {
    return roundHasResult(game)
      ? RpsGameState.HAS_RESULT
      : RpsGameState.PLAYERS_READY;
  }

  return RpsGameState.WAITING;
};

export const useGameState = (
  game: RPSSpectatorGameView | undefined
): RpsGameState => {
  const [state, setState] = useState(getGameInitialState(game));

  useEffect(() => {
    if ([RpsGameState.WAITING].includes(state)) {
      setState(getGameInitialState(game));
    }
  }, [game, state]);

  useEffect(() => {
    if (game && roundHasResult(game) && state === RpsGameState.PLAYERS_READY) {
      setState(RpsGameState.HAS_RESULT);
    }
  }, [game, state]);

  useEffect(() => {
    if (state === RpsGameState.HAS_RESULT) {
      setTimeout(() => setState(RpsGameState.SHOW_BETS), 3000);
    }
  }, [state]);

  useEffect(() => {
    if (state === RpsGameState.SHOW_BETS) {
      setTimeout(() => setState(RpsGameState.SHOW_MOVES), 3000);
    }
  }, [state]);

  useEffect(() => {
    if (state === RpsGameState.SHOW_MOVES) {
      setTimeout(() => setState(RpsGameState.SHOW_GAME_RESULT), 3000);
    }
  }, [state]);

  useEffect(() => {
    if (state === RpsGameState.SHOW_GAME_RESULT) {
      setTimeout(() => setState(RpsGameState.SHOW_BET_RESULT), 3000);
    }
  }, [state]);

  useEffect(() => {
    if (state === RpsGameState.SHOW_BET_RESULT) {
      setTimeout(() => setState(RpsGameState.FINISHED), 3000);
    }
  }, [state]);

  useEffect(() => {
    if (state === RpsGameState.FINISHED && game && !roundReady(game)) {
      setState(RpsGameState.WAITING);
    }
  }, [game, state]);

  return state;
};

// const useTimedStateTransitionEffect = (state: RpsGameState, props: {from: RpsGameState, to: RpsGameState, milliseconds: number}): void => {
//     useEffect(() => {
//         if (state === RpsGameState.SHOW_BETS) {
//           setTimeout(() => setState(RpsGameState.SHOW_MOVES), 3000);
//         }
//       }, [state]);

// }
