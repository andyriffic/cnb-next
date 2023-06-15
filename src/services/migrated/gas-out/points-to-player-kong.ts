import {
  getAllPlayers,
  updatePlayerLegacyTags,
} from "../../../utils/data/aws-dynamodb";
import { Player } from "../../../types/Player";
import { incrementIntegerTag } from "../../saveGameMoves";
import { GasGame } from "./types";

function giveKongImmunity(player: Player): Player {
  return {
    ...player,
    tags: [
      ...player.tags.filter((t) => t !== "kong_immunity"),
      "kong_immunity",
    ],
  };
}

function giveWinnerBonus(player: Player, game: GasGame): Player {
  const isWinner = player.id === game.winningPlayerId;
  const isMostPresses = game.mvpPlayerIds?.mostPresses?.includes(player.id);
  const isMostGuesses = game.mvpPlayerIds?.mostCorrectGuesses?.includes(
    player.id
  );

  if (isWinner || isMostGuesses || isMostPresses) {
    return giveKongImmunity(player);
  }

  return player;
}

function givePoints(player: Player, points: number): void {
  console.log("Giving points: ", player.id, points);
  const newTags = [
    ...incrementIntegerTag("sl_moves:", points, player.tags).filter(
      (t) => t !== "sl_participant"
    ),
    "sl_participant",
  ];
  updatePlayerLegacyTags(player.id, newTags).then(() => {
    console.log("Gave points: ", player.id, points);
  });
}

const MOST_PRESSESS_BONUS_POINTS = 2;

export function pointsToPlayersKong(game: GasGame) {
  getAllPlayers().then((allPlayers) => {
    if (!allPlayers) return;
    game.allPlayers.forEach((gasPlayer) => {
      const player = allPlayers.find((p) => p.id === gasPlayer.player.id);

      if (!player) return;

      const isMostPresses = game.mvpPlayerIds?.mostPresses?.includes(player.id);

      givePoints(
        giveWinnerBonus(player, game),
        gasPlayer.points + (isMostPresses ? MOST_PRESSESS_BONUS_POINTS : 0)
      );
    });
  });
}
