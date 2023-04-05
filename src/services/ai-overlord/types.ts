import * as TE from "fp-ts/TaskEither";
import { RPSMoveName } from "../rock-paper-scissors/types";

export type AiOverlordCreator = (
  opponents: AiOverlordOpponent[]
) => TE.TaskEither<string, AiOverlord>;

export type AiOverlordTauntCreator = (
  opponent: AiOverlordOpponent,
  aiOverlordGame: AiOverlordGame
) => TE.TaskEither<string, TranslatedText>;

export type AiOverlordMoveCreator = (
  opponent: AiOverlordOpponent,
  aiOverlordGame: AiOverlordGame
) => TE.TaskEither<string, RPSMoveName>;

export type AiOverlordBattleOutcomeCreator = (
  opponent: AiOverlordOpponent,
  opponentMove: RPSMoveName,
  overlordMove: RPSMoveName,
  aiOverlordGame: AiOverlordGame
) => TE.TaskEither<string, AiOverlordOpponentMoveWithText>;

export type AiOverlordGame = {
  gameId: string;
  opponents: AiOverlordOpponent[];
  aiOverlord: AiOverlord;
  taunts: AiOverlordTaunt[];
  opponentMoves: AiOverlordOpponentMove[];
};

export type AiOverlordTaunt = {
  playerId: string;
  taunt: TranslatedText;
};

export type TranslatedText = {
  english: string;
  chinese: string;
};

export type AiOverlordOpponentResult = "win" | "lose" | "draw";

export type AiOverlordOpponent = {
  playerId: string;
  name: string;
  occupation: string;
};

export type AiOverlordOpponentMove = {
  playerId: string;
  move: RPSMoveName;
};

export type AiOverlordOpponentMoveWithText = {
  opponentId: string;
  move: RPSMoveName;
  text: TranslatedText;
};

export type AiOverlord = {
  introduction: TranslatedText;
  moves: AiOverlordOpponentMoveWithText[];
};

export type AiOverlordBattle = {
  playerId: string;
  aiTaunt: string;
  aiMove?: RPSMoveName;
};
