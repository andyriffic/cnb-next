import type { NextApiRequest, NextApiResponse } from "next";
import getSaveGameForTeam from "../../services/save-game-moves";
import { PlayerGameMoves } from "../../services/save-game-moves/types";

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, method } = req;
  const { gameId, team } = query;

  if (!gameId) {
    res.status(400).json({ reason: "No gameId supplied" });
  }

  const playerMoves = req.body as PlayerGameMoves[];
  const teamLowerCase = (team as string)?.toLowerCase();
  const pointsAllocator = getSaveGameForTeam(teamLowerCase);

  switch (method) {
    case "PUT":
      try {
        console.info("Saving game moves for game", gameId, playerMoves);
        await pointsAllocator(gameId as string, playerMoves, team as string);
        res.status(200).send("OK");
      } catch (err) {
        console.error("Error when saving player details", err);
        res.status(500).json({ error: "Error when saving player details" });
      }
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
