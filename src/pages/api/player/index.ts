import type { NextApiRequest, NextApiResponse } from "next";
import { addPlayer, getPlayer } from "../../../utils/data/aws-dynamodb";

export type CreatePlayerParams = {
  id: string;
  name: string;
};

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const createPlayerParams = req.body as CreatePlayerParams;

  switch (method) {
    case "POST":
      console.log("Attempting to create player", createPlayerParams);
      const playerFromDb = await getPlayer(createPlayerParams.id as string);

      if (playerFromDb) {
        res.status(409);
        return;
      }

      await addPlayer(createPlayerParams.id, createPlayerParams.name);

      res.status(200).send("OK");
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
