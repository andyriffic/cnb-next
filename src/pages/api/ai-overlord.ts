import type { NextApiRequest, NextApiResponse } from "next";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { createAiOverlordGame } from "../../services/ai-overlord";
import { createAiOverlord as openAiOverlord } from "../../services/ai-overlord/openAi";

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      const game = await createAiOverlordGame(openAiOverlord)();

      pipe(
        game,
        E.fold(
          (err) => res.status(500).send({ error: err }),
          (game) => res.status(200).send(game)
        )
      );
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
