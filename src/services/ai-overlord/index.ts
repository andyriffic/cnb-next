import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { RPSMoveName } from "../rock-paper-scissors/types";
import { createAiBattleMove, createAiBattleTaunt } from "./openAi";
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
    opponentMoves: [],
  });

const addTauntToBattle =
  (playerId: string, game: AiOverlordGame) =>
  (taunt: TranslatedText): AiOverlordGame => {
    return { ...game, taunts: [...game.taunts, { playerId, taunt }] };
  };

const addOpponentMoveToBattle =
  (playerId: string, game: AiOverlordGame) =>
  (move: RPSMoveName): AiOverlordGame => {
    return {
      ...game,
      opponentMoves: [...game.opponentMoves, { playerId, move }],
    };
  };

const addAiMoveForOpponent =
  (opponentId: string, game: AiOverlordGame) =>
  (move: RPSMoveName): AiOverlordGame => {
    return {
      ...game,
      aiOverlord: {
        ...game.aiOverlord,
        moves: [...game.aiOverlord.moves, { playerId: opponentId, move }],
      },
    };
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

export const makeAiOpponentMove = (
  playerId: string,
  move: RPSMoveName,
  aiOverlordGame: AiOverlordGame
): TE.TaskEither<string, AiOverlordGame> => {
  const opponent = aiOverlordGame.opponents.find(
    (opponent) => opponent.playerId === playerId
  );
  if (!opponent) {
    return TE.left("Player not found");
  }

  return TE.right(addOpponentMoveToBattle(playerId, aiOverlordGame)(move));
};

export const makeAiMove = (
  opponentId: string,
  aiOverlordGame: AiOverlordGame
): TE.TaskEither<string, AiOverlordGame> => {
  const opponent = aiOverlordGame.opponents.find(
    (opponent) => opponent.playerId === opponentId
  );
  if (!opponent) {
    return TE.left("Opponent not found");
  }

  return pipe(
    createAiBattleMove(opponent, aiOverlordGame),
    TE.map(addAiMoveForOpponent(opponentId, aiOverlordGame))
  );
};
