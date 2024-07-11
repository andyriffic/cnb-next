import type { NextApiRequest, NextApiResponse } from "next";
import { savePlayersGameMoves } from "../../services/save-game-moves/saveGameMovesZombieRun";
import { PlayerGameMoves } from "../../services/save-game-moves/types";

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;
  const { gameId, team } = query;

  if (!gameId) {
    res.status(400).json({ reason: "No gameId supplied" });
  }

  const playerMoves = req.body as PlayerGameMoves[];

  switch (method) {
    case "PUT":
      try {
        console.info("Saving game moves for game", gameId, playerMoves);
        await savePlayersGameMoves(
          gameId as string,
          playerMoves,
          team as string
        );
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
