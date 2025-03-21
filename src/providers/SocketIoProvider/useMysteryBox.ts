import { useCallback, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {
  CreateMysteryBoxGameHandler,
  MYSTERY_BOX_ACTIONS,
  NewRoundMysteryBoxHandler,
  PlayerSelectMysteryBoxHandler,
} from "../../services/mystery-box/socket.io";
import { MysteryBoxGame } from "../../services/mystery-box/types";

export type MysteryBoxSocketService = {
  games: MysteryBoxGame[];
  createGame: CreateMysteryBoxGameHandler;
  playerSelectBox: PlayerSelectMysteryBoxHandler;
  newRound: NewRoundMysteryBoxHandler;
};

export function useMysteryBox(socket: Socket): MysteryBoxSocketService {
  const [games, setGames] = useState<MysteryBoxGame[]>([]);

  const createGame = useCallback<CreateMysteryBoxGameHandler>(
    (gameId, players, onCreated) =>
      socket.emit(MYSTERY_BOX_ACTIONS.CREATE_GAME, gameId, players, onCreated),
    [socket]
  );

  const playerSelectBox = useCallback<PlayerSelectMysteryBoxHandler>(
    (gameId, playerId, roundId, boxId) =>
      socket.emit(
        MYSTERY_BOX_ACTIONS.MAKE_PLAYER_GUESS,
        gameId,
        playerId,
        roundId,
        boxId
      ),
    [socket]
  );

  const newRound = useCallback<NewRoundMysteryBoxHandler>(
    (gameId) => socket.emit(MYSTERY_BOX_ACTIONS.NEW_ROUND, gameId),
    [socket]
  );

  useEffect(() => {
    console.log("Setting up Mystery Box socket connection");
    socket.on(MYSTERY_BOX_ACTIONS.GAME_UPDATE, (games: MysteryBoxGame[]) => {
      console.log("Mystery Box Games", games);
      setGames(games);
    });

    return () => {
      console.log("Disconnecting Number Crunch Socket");
      socket.off(MYSTERY_BOX_ACTIONS.GAME_UPDATE);
    };
  }, [socket]);

  return {
    games,
    createGame,
    playerSelectBox,
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
