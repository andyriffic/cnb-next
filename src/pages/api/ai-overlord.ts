import type { NextApiRequest, NextApiResponse } from "next";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import {
  createAiOverlordGame,
  preparePlayerForBattle,
} from "../../services/ai-overlord";
import { createAiOverlord as openAiOverlord } from "../../services/ai-overlord/openAi";
import { AiOverlordGame } from "../../services/ai-overlord/types";

let callCount = 0;
let overlordGames: AiOverlordGame[] = [];

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  callCount++;
  const { method, query } = req;
  const { overlordId } = query;
  const game = overlordGames.find((game) => game.gameId === overlordId);

  switch (method) {
    case "GET":
      if (game) {
        const battle = await preparePlayerForBattle("kate", game)();
        pipe(
          battle,
          E.fold(
            (err) => res.status(500).send({ error: err }),
            (game) => {
              res.status(200).send({ overlordId, battle });
            }
          )
        );
      } else {
        const game = await createAiOverlordGame(openAiOverlord, [
          { playerId: "andy", name: "Andy", occupation: "Lead Developer" },
          { playerId: "marion", name: "Marion", occupation: "Product Manager" },
          { playerId: "nina", name: "Nina", occupation: "Delivery Lead" },
          { playerId: "kate", name: "Kate", occupation: "UX Designer" },
        ])();

        pipe(
          game,
          E.fold(
            (err) => res.status(500).send({ error: err }),
            (game) => {
              overlordGames = [
                ...overlordGames.filter((g) => g.gameId !== overlordId),
                game,
              ];
              res.status(200).send({ callCount, game });
            }
          )
        );
      }

      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
