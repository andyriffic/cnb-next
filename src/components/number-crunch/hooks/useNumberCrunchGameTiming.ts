import { useEffect, useState } from "react";
import { NumberCrunchGameView } from "../../../services/number-crunch/types";
import { useSocketIo } from "../../../providers/SocketIoProvider";

export enum NUMBER_CRUNCH_GAME_STATE {
  PLAYERS_GUESSING = 0,
  WAITING_TO_REVEAL_ROUND = 1,
  REVEALING_LATEST_ROUND = 2,
  LATEST_ROUND_REVEALED = 3,
  START_NEW_ROUND = 4,
  REVEAL_WINNER = 5,
  SHOW_RESULTS = 6,
}

export const useNumberCrunchGameTiming = (
  gameView: NumberCrunchGameView
): {
  state: NUMBER_CRUNCH_GAME_STATE;
  setState: (state: NUMBER_CRUNCH_GAME_STATE) => void;
} => {
  const [gameState, setGameState] = useState(
    NUMBER_CRUNCH_GAME_STATE.PLAYERS_GUESSING
  );
  const { numberCrunch } = useSocketIo();

  useEffect(() => {
    if (
      gameState === NUMBER_CRUNCH_GAME_STATE.PLAYERS_GUESSING &&
      gameView.currentRound.allPlayersGuessed
    ) {
      setTimeout(
        () => setGameState(NUMBER_CRUNCH_GAME_STATE.WAITING_TO_REVEAL_ROUND),
        1000
      );
    }
  }, [gameState, gameView.currentRound.allPlayersGuessed]);

  useEffect(() => {
    if (!gameView.currentRound.allPlayersGuessed) {
      setGameState(NUMBER_CRUNCH_GAME_STATE.PLAYERS_GUESSING);
    }
  }, [gameState, gameView.currentRound.allPlayersGuessed]);

  useEffect(() => {
    if (gameState === NUMBER_CRUNCH_GAME_STATE.LATEST_ROUND_REVEALED) {
      if (gameView.finalResults) {
        setTimeout(
          () => setGameState(NUMBER_CRUNCH_GAME_STATE.REVEAL_WINNER),
          1000
        );
      } else {
        setTimeout(
          () => setGameState(NUMBER_CRUNCH_GAME_STATE.START_NEW_ROUND),
          100
        );
      }
    }
  }, [gameState, gameView.finalResults, gameView.id, numberCrunch]);

  useEffect(() => {
    if (gameState === NUMBER_CRUNCH_GAME_STATE.START_NEW_ROUND) {
      setTimeout(() => numberCrunch.newRound(gameView.id), 4000);
    }
  }, [gameState, gameView.id, numberCrunch]);

  useEffect(() => {
    if (
      gameState === NUMBER_CRUNCH_GAME_STATE.REVEAL_WINNER &&
      gameView.currentRound.allPlayersGuessed
    ) {
      setTimeout(() => {
        setGameState(NUMBER_CRUNCH_GAME_STATE.SHOW_RESULTS);
      }, 2000);
    }
  }, [gameState, gameView.currentRound.allPlayersGuessed]);

  return { state: gameState, setState: setGameState };
};
