import type { NextApiRequest, NextApiResponse } from "next";
import { Player, PlayerDetails } from "../../../../types/Player";
import { getPlayer, updatePlayer } from "../../../../utils/data/aws-dynamodb";

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;
  const { id } = query;
  const playerDetails = req.body as Partial<PlayerDetails>;

  switch (method) {
    // case 'GET': //TODO: Can get from GraphQL at the moment
    //   // Get data from your database
    //   res.status(200).json({ id, name: `User ${id}` })
    //   break
    case "PUT":
      // Update or create data in your database
      console.log("UPDATING", id, playerDetails);
      const playerOrNull = await getPlayer(id as string);
      console.info("Got player", playerOrNull);

      if (!playerOrNull) {
        res.status(404);
        return;
      }

      await updatePlayer(playerOrNull.id, {
        ...playerOrNull.details,
        ...playerDetails,
      });
      res.status(200).json({ id, ...playerDetails });
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
