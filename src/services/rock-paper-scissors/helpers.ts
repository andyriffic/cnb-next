import { RPSSpectatorGameView } from "./types";

export const roundReady = (game: RPSSpectatorGameView): boolean => {
  const bothPlayersReady =
    game.currentRound.movedPlayerIds.length === game.playerIds.length;

  return bothPlayersReady;
};

export const roundHasResult = (game: RPSSpectatorGameView): boolean => {
  return !!game.currentRound.result;
};
