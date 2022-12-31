import { RPSSpectatorGameView, RPSSpectatorRoundView } from "./types";

export const latestRound = (
  game: RPSSpectatorGameView
): RPSSpectatorRoundView => {
  return game.rounds[game.rounds.length - 1]!;
};

export const roundReady = (game: RPSSpectatorGameView): boolean => {
  const gameRound = latestRound(game);

  const bothPlayersReady =
    gameRound.movedPlayerIds.length === game.playerIds.length;

  return bothPlayersReady;
};

export const roundHasResult = (game: RPSSpectatorGameView): boolean => {
  const gameRound = latestRound(game);

  return !!gameRound.result;
};
