import { RPSSpectatorGameView, RPSSpectatorRoundView } from "./types";

export const latestRound = (
  game: RPSSpectatorGameView
): RPSSpectatorRoundView => {
  return game.rounds[game.rounds.length - 1]!;
};
