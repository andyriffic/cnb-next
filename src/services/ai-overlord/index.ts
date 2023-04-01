import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { createAiBattleTaunt } from "./openAi";
import {
  AiOverlord,
  AiOverlordCreator,
  AiOverlordGame,
  AiOverlordOpponent,
  TranslatedText,
} from "./types";

const createAiGame =
  (id: string, opponents: AiOverlordOpponent[]) =>
  (aiOverlord: AiOverlord): AiOverlordGame => ({
    gameId: id,
    opponents,
    aiOverlord,
    taunts: [],
  });

const addTauntToBattle =
  (playerId: string, game: AiOverlordGame) =>
  (taunt: TranslatedText): AiOverlordGame => {
    return { ...game, taunts: [...game.taunts, { playerId, taunt }] };
  };

export const createAiOverlordGame = (
  id: string,
  createAiOverlord: AiOverlordCreator,
  opponents: AiOverlordOpponent[]
): TE.TaskEither<string, AiOverlordGame> => {
  return pipe(createAiOverlord(opponents), TE.map(createAiGame(id, opponents)));
};

export const preparePlayerForBattle = (
  playerId: string,
  aiOverlordGame: AiOverlordGame
): TE.TaskEither<string, AiOverlordGame> => {
  const opponent = aiOverlordGame.opponents.find(
    (opponent) => opponent.playerId === playerId
  );
  if (!opponent) {
    return TE.left("Player not found");
  }
  return pipe(
    createAiBattleTaunt(opponent, aiOverlordGame),
    TE.map(addTauntToBattle(playerId, aiOverlordGame))
  );
};
