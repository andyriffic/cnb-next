import { useEffect, useState } from "react";
import {
  GroupBettingGame,
  GroupPlayerBettingRound,
} from "../../../services/betting/types";
import {
  roundHasResult,
  roundReady,
} from "../../../services/rock-paper-scissors/helpers";
import { RPSSpectatorGameView } from "../../../services/rock-paper-scissors/types";

export enum RpsGameState {
  WAITING = 0,
  READY_TO_PLAY = 1,
  HAS_RESULT = 2,
  SHOW_BETS = 3,
  SHOW_MOVES = 4,
  SHOW_GAME_RESULT = 5,
  HIGHLIGHT_WINNING_SPECTATORS = 6,
  SHOW_GAME_STATUS = 7,
  FINISHED = 8,
}

const everyoneHasBet = (bettingGame: GroupBettingGame | undefined): boolean =>
  bettingGame
    ? bettingGame.currentRound.playerBets.length ===
      bettingGame.playerWallets.length
    : false;

const getGameInitialState = (
  game: RPSSpectatorGameView | undefined,
  betGame: GroupBettingGame | undefined
): RpsGameState => {
  if (game && roundReady(game) && everyoneHasBet(betGame)) {
    return roundHasResult(game)
      ? RpsGameState.HAS_RESULT
      : RpsGameState.READY_TO_PLAY;
  }

  return RpsGameState.WAITING;
};

export const useGameState = (
  game: RPSSpectatorGameView | undefined,
  betGame: GroupBettingGame | undefined
): { state: RpsGameState; setGameState: (state: RpsGameState) => void } => {
  const [state, setState] = useState(getGameInitialState(game, betGame));

  useEffect(() => {
    if ([RpsGameState.WAITING].includes(state)) {
      setState(getGameInitialState(game, betGame));
    }
  }, [game, state, betGame]);

  useEffect(() => {
    if (
      game &&
      roundHasResult(game) &&
      everyoneHasBet(betGame) &&
      state === RpsGameState.READY_TO_PLAY
    ) {
      setState(RpsGameState.HAS_RESULT);
    }
  }, [game, betGame, state]);

  useEffect(() => {
    if (state === RpsGameState.HAS_RESULT) {
      setTimeout(() => setState(RpsGameState.SHOW_BETS), 3000);
    }
  }, [state]);

  useEffect(() => {
    if (state === RpsGameState.SHOW_BETS) {
      const choiceTotals = betGame?.currentRound.bettingOptions.reduce<
        number[]
      >(
        (acc, bo) => [
          ...acc,
          betGame.currentRound.playerBets.filter(
            (pb) => pb.betOptionId === bo.id
          ).length,
        ],
        []
      );
      const maxPlayerChoice = choiceTotals ? Math.max(...choiceTotals) : 0;

      // const maxPlayersChoice = betGame?.currentRound.playerBets.reduce((acc, pb) => return )
      setTimeout(
        () => setState(RpsGameState.SHOW_MOVES),
        maxPlayerChoice * 800 + 1000
      );
    }
  }, [betGame, state]);

  useEffect(() => {
    if (state === RpsGameState.SHOW_MOVES) {
      setTimeout(() => setState(RpsGameState.SHOW_GAME_RESULT), 3000);
    }
  }, [state]);

  useEffect(() => {
    if (state === RpsGameState.SHOW_GAME_RESULT) {
      setTimeout(
        () => setState(RpsGameState.HIGHLIGHT_WINNING_SPECTATORS),
        3000
      );
    }
  }, [state]);

  useEffect(() => {
    if (state === RpsGameState.HIGHLIGHT_WINNING_SPECTATORS) {
      setTimeout(() => setState(RpsGameState.SHOW_GAME_STATUS), 3000);
    }
  }, [state]);

  useEffect(() => {
    if (state === RpsGameState.SHOW_GAME_STATUS) {
      setTimeout(() => setState(RpsGameState.FINISHED), 3000);
    }
  }, [state]);

  useEffect(() => {
    if (state === RpsGameState.FINISHED && game && !roundReady(game)) {
      setState(RpsGameState.WAITING);
    }
  }, [game, state]);

  return { state, setGameState: setState };
};

// const useTimedStateTransitionEffect = (state: RpsGameState, props: {from: RpsGameState, to: RpsGameState, milliseconds: number}): void => {
//     useEffect(() => {
//         if (state === RpsGameState.SHOW_BETS) {
//           setTimeout(() => setState(RpsGameState.SHOW_MOVES), 3000);
//         }
//       }, [state]);

// }
