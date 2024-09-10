import type { NextApiRequest, NextApiResponse } from "next";
import { PlayerDetails } from "../../../../../types/Player";
import {
  getPlayer,
  updatePlayer,
} from "../../../../../utils/data/aws-dynamodb";

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;
  const { id } = query;
  console.log("DELETE SPACE RACE DETAILS", id);

  switch (method) {
    case "DELETE": {
      console.log("Attempting to delete player space race details", id);
      const playerOrNull = await getPlayer(id as string);
      console.info("Got player", playerOrNull);

      if (!playerOrNull) {
        res.status(404);
        return;
      }

      const playerDetails: PlayerDetails = {
        ...playerOrNull.details,
      };
      delete playerDetails.spaceRace;

      await updatePlayer(id as string, playerDetails);

      res.status(200).send("OK");
      break;
    }
    default: {
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
