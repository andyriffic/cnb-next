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
  if (player.id !== game.winningPlayerId) {
    return player;
  }

  return giveKongImmunity(player);
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

export function pointsToPlayersKong(game: GasGame) {
  getAllPlayers().then((allPlayers) => {
    if (!allPlayers) return;
    game.allPlayers.forEach((gasPlayer) => {
      const player = allPlayers.find((p) => p.id === gasPlayer.player.id);

      if (!player) return;

      givePoints(giveWinnerBonus(player, game), gasPlayer.points);
    });
  });
}
