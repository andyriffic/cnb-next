import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { AiOverlord, AiOverlordCreator, AiOverlordGame } from "./types";

const createAiGame = (aiOverlord: AiOverlord): AiOverlordGame => ({
  gameId: "123",
  opponents: [],
  aiOverlord,
});

export const createAiOverlordGame = (
  aiCreator: AiOverlordCreator
): TE.TaskEither<string, AiOverlordGame> => {
  //   const aiOverlord = await aiCreator("123");

  return pipe(
    aiCreator(),
    TE.chain((aiOverlord) => TE.right(createAiGame(aiOverlord)))
  );

  //   return Promise.resolve({
  //     gameId: "123",
  //     opponents: [],
  //     aiOverlord,
  //   });
};
