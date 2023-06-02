import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  createAiOverlordGame,
  preparePlayerForBattle,
} from "../../services/ai-overlord";
import { createOpenAiOverlord as openAiOverlord } from "../../services/ai-overlord/openAi";
import { AiOverlordOpponent } from "../../services/ai-overlord/types";
import {
  getInMemoryAiOverlordGame,
  updateInMemoryAiOverlordGame,
} from "../../utils/data/in-memory";

let callCount = 0;

export type ApiGameCreationRequest = {
  opponents: AiOverlordOpponent[];
};

export type ApiAiOverlordNewOpponentRequest = {
  gameId: string;
  opponentId: string;
};

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  callCount++;
  const { method, query } = req;
  const { overlordId } = query;

  switch (method) {
    case "GET": {
      const game = getInMemoryAiOverlordGame(overlordId as string);

      if (game) {
        res.status(200).json(game);
      } else {
        res.status(404).send({ error: `Game '${overlordId}' not found` });
      }

      break;
    }
    case "POST": {
      const { gameId, opponentId } =
        req.body as ApiAiOverlordNewOpponentRequest;
      const game = getInMemoryAiOverlordGame(gameId);
      if (!game) {
        res.status(404).send({ error: `Game '${overlordId}' not found` });
        return;
      }
      console.log("Starting battle with ", opponentId);
      const battle = await preparePlayerForBattle(opponentId, game)();
      pipe(
        battle,
        E.fold(
          (err) => res.status(500).send({ error: err }),
          (game) => {
            updateInMemoryAiOverlordGame(game);
            res.status(200).json(game);
          }
        )
      );

      break;
    }
    case "PUT": {
      const { opponents } = req.body as ApiGameCreationRequest;
      console.log("Create Ai Overlord game", opponents);
      const game = await createAiOverlordGame(
        "123",
        openAiOverlord,
        opponents
      )();

      pipe(
        game,
        E.fold(
          (err) => res.status(500).send({ error: err }),
          (game) => {
            console.log("Created game", game);
            updateInMemoryAiOverlordGame(game);
            res.status(200).json(game);
          }
        )
      );
      break;
    }
    default:
      res.setHeader("Allow", ["PUT, GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
