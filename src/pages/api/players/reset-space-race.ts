import type { NextApiRequest, NextApiResponse } from "next";
import { getAllPlayers, updatePlayer } from "../../../utils/data/aws-dynamodb";
import { PlayerDetails } from "../../../types/Player";
import { SETTINGS_PLAYER_ID } from "../../../constants";

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;
  const { id } = query;

  switch (method) {
    case "PUT":
      console.log("RESETTING SPACE RACE FOR ALL PLAYERS");
      const allPlayers = await getAllPlayers();

      if (!allPlayers) {
        console.info("No players found in DB");
        res.status(404);
        return;
      }

      allPlayers
        .filter((p) => p.id !== SETTINGS_PLAYER_ID)
        .filter((p) => !!p.details?.spaceRace)
        .forEach(async (player) => {
          const playerDetails: PlayerDetails = {
            ...player.details,
          };
          delete playerDetails.spaceRace;

          await updatePlayer(player.id, playerDetails).then(() =>
            console.info("Reset player space race details", player.id)
          );
        });

      res.status(200).send("OK");
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
