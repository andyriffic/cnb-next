import { Socket, Server as SocketIOServer } from "socket.io";

import { getAllPlayers } from "../../../utils/data/aws-dynamodb";
import { sendClientMessage } from "../../socket";
import { pointsToPlayersKong as pointsToPlayer } from "./points-to-player-kong";
import { GasGame, GlobalEffect } from "./types";
import {
  createGame,
  makeNextPlayerOutGuess,
  moveToNextAlivePlayerWithReverseDeath,
  playCard,
  playEffect,
  playerTimedOut,
  press,
  resetCloud,
} from ".";

export const REQUEST_GAS_GAMES = "REQUEST_GAS_GAMES";
export const GAS_GAMES_UPDATE = "GAS_GAMES_UPDATE";
export const CREATE_GAS_GAME = "CREATE_GAS_GAME";
export const PLAY_GAS_CARD = "PLAY_GAS_CARD";
export const PRESS_GAS = "PRESS_GAS";
export const NEXT_GAS_PAYER = "NEXT_GAS_PAYER";
export const GUESS_NEXT_PLAYER_OUT = "GUESS_NEXT_PLAYER_OUT";
export const PLAYER_TIMED_OUT = "PLAYER_TIMED_OUT";
export const PLAY_EFFECT = "PLAY_EFFECT";

function getGameOrThrow(allGames: GasGame[], gameId: string): GasGame {
  const game = allGames.find((g) => g.id === gameId);
  if (!game) {
    throw `Game ${gameId} not found`;
  }

  return game;
}

function updateGames(allGames: GasGame[], game: GasGame): GasGame[] {
  return allGames.map((g) => (g.id === game.id ? game : g));
}

let activeGasGames: GasGame[] = [];

export const initialiseGasOutSocket = (io: SocketIOServer, socket: Socket) => {
  socket.on(
    CREATE_GAS_GAME,
    (playerIds: string[], gameId: string, onCreated: (id: string) => void) => {
      getAllPlayers().then((playersFromDb) => {
        if (!playersFromDb) return;

        const players = playersFromDb.filter((p) => playerIds.includes(p.id));
        const gasGame = createGame({ id: gameId, players });
        console.log("Created GasGame", gasGame);
        activeGasGames = [gasGame]; //Only allow one mobGame at a time for now
        io.emit(GAS_GAMES_UPDATE, activeGasGames);
        onCreated(gasGame.id);
      });
    }
  );

  socket.on(
    PLAY_GAS_CARD,
    (gameId: string, playerId: string, cardIndex: number) => {
      console.log(PLAY_GAS_CARD, gameId, playerId, cardIndex);
      const game = getGameOrThrow(activeGasGames, gameId);

      const updatedGame = playCard(game, playerId, cardIndex);
      activeGasGames = updateGames(activeGasGames, updatedGame);

      // console.log('UPDATED GAME', updatedGame);
      io.emit(GAS_GAMES_UPDATE, activeGasGames);
    }
  );

  socket.on(PRESS_GAS, (gameId: string) => {
    console.log(PRESS_GAS, gameId);
    const game = getGameOrThrow(activeGasGames, gameId);

    const updatedGame = press(game);
    activeGasGames = updateGames(activeGasGames, updatedGame);

    // console.log('UPDATED GAME', updatedGame);
    io.emit(GAS_GAMES_UPDATE, activeGasGames);

    if (!!updatedGame.winningPlayerId) {
      pointsToPlayer(updatedGame);
    }
  });

  socket.on(NEXT_GAS_PAYER, (gameId: string) => {
    console.log(NEXT_GAS_PAYER, gameId);
    const game = getGameOrThrow(activeGasGames, gameId);

    const updatedGame = moveToNextAlivePlayerWithReverseDeath(resetCloud(game));
    activeGasGames = updateGames(activeGasGames, updatedGame);

    // console.log('UPDATED GAME', updatedGame);
    io.emit(GAS_GAMES_UPDATE, activeGasGames);
  });

  socket.on(PLAY_EFFECT, (gameId: string, globalEffect: GlobalEffect) => {
    console.log(PLAY_EFFECT, gameId, globalEffect);
    const game = getGameOrThrow(activeGasGames, gameId);

    const updatedGame = playEffect(game, globalEffect);
    activeGasGames = updateGames(activeGasGames, updatedGame);

    // console.log('UPDATED GAME', updatedGame);
    io.emit(GAS_GAMES_UPDATE, activeGasGames);
  });

  socket.on(
    GUESS_NEXT_PLAYER_OUT,
    (gameId: string, playerId: string, guessPlayerId: string) => {
      console.log(GUESS_NEXT_PLAYER_OUT, gameId);
      const game = getGameOrThrow(activeGasGames, gameId);

      const updatedGame = makeNextPlayerOutGuess(game, playerId, guessPlayerId);
      activeGasGames = updateGames(activeGasGames, updatedGame);

      // console.log('UPDATED GAME', updatedGame);
      io.emit(GAS_GAMES_UPDATE, activeGasGames);
    }
  );

  socket.on(PLAYER_TIMED_OUT, (gameId: string, playerId: string) => {
    console.log(PLAYER_TIMED_OUT, gameId, playerId);
    const game = getGameOrThrow(activeGasGames, gameId);

    const updatedGame = playerTimedOut(game, playerId);
    activeGasGames = updateGames(activeGasGames, updatedGame);

    // console.log('UPDATED GAME', updatedGame);
    io.emit(GAS_GAMES_UPDATE, activeGasGames);

    if (!!updatedGame.winningPlayerId) {
      pointsToPlayer(updatedGame);
    }
  });

  socket.emit(GAS_GAMES_UPDATE, activeGasGames);
  sendClientMessage(socket, "Welcome to Balloon game 🎈");
};