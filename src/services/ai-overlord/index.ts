import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { Player } from "../../types/Player";
import { getAllPlayersTE } from "../../utils/data/aws-dynamodb";
import { getPlayerAttributeValueFromTags } from "../../utils/string";
import { RPSMoveName } from "../rock-paper-scissors/types";
import {
  createAiBattleMove,
  createAiBattleOutcome,
  createAiBattleTaunt,
  createAiOverlordGameSummary,
} from "./openAi";
import {
  AiOverlord,
  AiOverlordCreator,
  AiOverlordGame,
  AiOverlordOpponent,
  AiOverlordOpponentMoveWithTextAndOutcome,
  AiOverlordTaunt,
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

export const createEmptyAiOverlord = (): TE.TaskEither<string, AiOverlord> => {
  return TE.right({
    initialised: false,
    introduction: { english: "", chinese: "" },
    moves: [],
    finalSummary: { english: "", chinese: "" },
  });
};

export const setAiOverlordOnGame = (
  aiOverlord: AiOverlord,
  game: AiOverlordGame
): AiOverlordGame => {
  return {
    ...game,
    aiOverlord,
  };
};

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
  (game: AiOverlordGame) =>
  (move: AiOverlordOpponentMoveWithTextAndOutcome): AiOverlordGame => {
    return {
      ...game,
      aiOverlord: {
        ...game.aiOverlord,
        moves: [...game.aiOverlord.moves, move],
      },
    };
  };

const mapPlayerToOpponent = (player: Player): AiOverlordOpponent => ({
  playerId: player.id,
  name: player.name,
  occupation: getPlayerAttributeValueFromTags(player.tags, "role", ""),
  interests: getPlayerAttributeValueFromTags(player.tags, "interests", ""),
});

export const createAiOpponents = (
  playerIds: string[]
): TE.TaskEither<string, AiOverlordOpponent[]> => {
  return pipe(
    getAllPlayersTE(),
    TE.map((players) =>
      players.filter((player) => playerIds.includes(player.id))
    ),
    TE.map((players) => players.map(mapPlayerToOpponent))
  );
};

export const createAiOverlordGame = (
  id: string,
  createAiOverlord: AiOverlordCreator,
  opponents: AiOverlordOpponent[]
): TE.TaskEither<string, AiOverlordGame> => {
  return pipe(createAiOverlord(), TE.map(createAiGame(id, opponents)));
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
    createAiBattleTaunt(opponent),
    TE.map(addTauntToBattle(playerId, aiOverlordGame))
  );
};

export const prepareAllPlayerTaunts = (
  aiOverlordGame: AiOverlordGame
): TE.TaskEither<string, readonly AiOverlordTaunt[]> => {
  const getPlayerTaunt = (
    opponent: AiOverlordOpponent
  ): TE.TaskEither<string, AiOverlordTaunt> => {
    return pipe(
      createAiBattleTaunt(opponent),
      TE.map((taunt) => ({ playerId: opponent.playerId, taunt })),
      TE.map((taunt) => {
        console.log("taunt", taunt);
        return taunt;
      })
    );
  };

  return pipe(aiOverlordGame.opponents.map(getPlayerTaunt), TE.sequenceArray);
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

  const opponentMove = aiOverlordGame.opponentMoves.find(
    (m) => m.playerId === opponentId
  );
  if (!opponentMove) {
    return TE.left("Opponent hasn't moved yet");
  }

  return pipe(
    createAiBattleMove(opponent, aiOverlordGame),
    TE.chain((robotMove) =>
      createAiBattleOutcome(
        opponent,
        opponentMove.move,
        robotMove,
        aiOverlordGame
      )
    ),
    TE.map(addAiMoveForOpponent(aiOverlordGame))
  );
};

export const finaliseAiGame = (
  aiOverlordGame: AiOverlordGame
): TE.TaskEither<string, AiOverlordGame> => {
  return pipe(
    createAiOverlordGameSummary(aiOverlordGame),
    TE.map(
      (summary) =>
        ({
          ...aiOverlordGame,
          aiOverlord: { ...aiOverlordGame.aiOverlord, finalSummary: summary },
        } as AiOverlordGame)
    )
  );
};
