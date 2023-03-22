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
      console.log("UPDATING PLAYER", id);
      const playerFromDb = await getPlayer(id as string);
      console.info("Got player", playerFromDb);

      if (!playerFromDb) {
        res.status(404);
        return;
      }

      const currentWhosThatCount = playerFromDb.details?.whosThatCount || 0;

      await updatePlayer(playerFromDb.id, {
        ...playerFromDb.details,
        whosThatCount: currentWhosThatCount + 1,
      });
      res.status(200).json({ id, whosThatCount: currentWhosThatCount });
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
