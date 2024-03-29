import { useCallback, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {
  CreateNumberCrunchGameHandler,
  MakeNumberCrunchPlayerGuessGameHandler,
  NUMBER_CRUNCH_ACTIONS,
  NewNumberCrunchRoundHandler,
} from "../../services/number-crunch/socket.io";
import {
  NumberCrunchGame,
  NumberCrunchGameView,
} from "../../services/number-crunch/types";

export type NumberCrunchSocketService = {
  games: NumberCrunchGameView[];
  createGame: CreateNumberCrunchGameHandler;
  makePlayerGuess: MakeNumberCrunchPlayerGuessGameHandler;
  newRound: NewNumberCrunchRoundHandler;
};

export function useNumberCrunch(socket: Socket): NumberCrunchSocketService {
  const [games, setGames] = useState<NumberCrunchGameView[]>([]);

  const createGame = useCallback<CreateNumberCrunchGameHandler>(
    (gameId, players, onCreated) =>
      socket.emit(
        NUMBER_CRUNCH_ACTIONS.CREATE_GAME,
        gameId,
        players,
        onCreated
      ),
    [socket]
  );

  const makePlayerGuess = useCallback<MakeNumberCrunchPlayerGuessGameHandler>(
    (gameId, playerId, guess) =>
      socket.emit(
        NUMBER_CRUNCH_ACTIONS.MAKE_PLAYER_GUESS,
        gameId,
        playerId,
        guess
      ),
    [socket]
  );

  const newRound = useCallback<NewNumberCrunchRoundHandler>(
    (gameId) => socket.emit(NUMBER_CRUNCH_ACTIONS.NEW_ROUND, gameId),
    [socket]
  );

  useEffect(() => {
    console.log("Setting up Number Crunch socket connection");
    socket.on(
      NUMBER_CRUNCH_ACTIONS.GAME_UPDATE,
      (games: NumberCrunchGameView[]) => {
        console.log("Number Crunch Games", games);
        setGames(games);
      }
    );

    return () => {
      console.log("Disconnecting Number Crunch Socket");
      socket.off(NUMBER_CRUNCH_ACTIONS.GAME_UPDATE);
    };
  }, [socket]);

  return {
    games,
    createGame,
    makePlayerGuess,
    newRound,
  };
}

// Helper for individual betting game
// export function useBettingGame(gameId: string): {
//   bettingGame: GroupBettingGame | undefined;
//   makePlayerBet: (playerBet: PlayerBet) => void;
//   resolveBettingRound: (winningOptionId: string) => void;
//   newBettingRound: () => void;
// } {
//   const {
//     groupBetting: {
//       bettingGames,
//       makePlayerBet,
//       resolveBettingRound,
//       addNewBettingRound,
//     },
//   } = useSocketIo();

//   const bettingGame = useMemo(() => {
//     return bettingGames.find((g) => g.id === gameId);
//   }, [gameId, bettingGames]);

//   const makeBet = useCallback(
//     (playerBet: PlayerBet) => {
//       return makePlayerBet(gameId, playerBet);
//     },
//     [gameId, makePlayerBet]
//   );

//   const resolveRound = useCallback(
//     (winningOptionId: string) => {
//       return resolveBettingRound(gameId, winningOptionId);
//     },
//     [gameId, resolveBettingRound]
//   );

//   const newRound = useCallback(() => {
//     return addNewBettingRound(gameId);
//   }, [gameId, addNewBettingRound]);

//   return {
//     bettingGame,
//     makePlayerBet: makeBet,
//     resolveBettingRound: resolveRound,
//     newBettingRound: newRound,
//   };
// }
