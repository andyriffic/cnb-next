import type { NextApiRequest, NextApiResponse } from "next";
import {
  getPlayer,
  updatePlayer,
} from "../../../../utils/data/aws-dynamodb-players";

type UpdateRequest = {
  cellIndex: number;
  movesRemaining: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;
  const { cellIndex, movesRemaining } = (req.body ?? {}) as UpdateRequest;
  if (
    !Number.isInteger(cellIndex) ||
    cellIndex < 0 ||
    cellIndex > 51 ||
    !Number.isInteger(movesRemaining) ||
    movesRemaining < 0
  ) {
    return res.status(400).json({ error: "Invalid game position" });
  }

  const player = await getPlayer(id as string);
  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }

  await updatePlayer(player.id, {
    ...player.details,
    snakesAndLadders: {
      isParticipant: true,
      cellIndex,
      movesRemaining,
    },
  });
  return res.status(200).json({ cellIndex, movesRemaining });
}