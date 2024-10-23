import type { NextApiRequest, NextApiResponse } from "next";
import { getPlayer, updatePlayer } from "../../../../utils/data/aws-dynamodb";

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;
  const { id } = query;

  switch (method) {
    case "PUT":
      console.log("DEDUCTING AVAILABLE COIN FROM PLAYER", id);
      const playerFromDb = await getPlayer(id as string);
      console.info("Got player", playerFromDb);

      if (!playerFromDb) {
        res.status(404);
        return;
      }

      const currentAvailableCoins = playerFromDb.details?.availableCoins || 0;

      if (currentAvailableCoins <= 0) {
        console.info(
          `Player ${id} does not have enough coins (${currentAvailableCoins})`,
          playerFromDb
        );
        res.status(400).json({ error: "No available coins to deduct" });
        return;
      }

      const availableCoins = currentAvailableCoins - 1;

      await updatePlayer(playerFromDb.id, {
        ...playerFromDb.details,
        availableCoins,
      });
      res.status(200).json({ id, availableCoins: availableCoins });
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
