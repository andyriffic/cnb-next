import * as TE from "fp-ts/TaskEither";
import { AiOverlord, AiOverlordCreator } from "./types";
import { createAiOverlordGame } from ".";

const stubAiCreator: AiOverlordCreator = () =>
  TE.right({
    introduction: { english: "Hi", chinese: "" },
    battles: [],
    initialised: false,
    moves: [],
  } as AiOverlord);

test("Can create game successfully", async () => {
  const game = await createAiOverlordGame("game Id", stubAiCreator, [])();
  expect(game).toBeRight();
  expect(game).toSubsetEqualRight({ aiOverlord: { introduction: "Hi" } });
});
