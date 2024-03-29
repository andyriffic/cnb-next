import * as TE from "fp-ts/TaskEither";
import { RPSMoveName } from "../rock-paper-scissors/types";

export type AiOverlordCreator = () => TE.TaskEither<string, AiOverlord>;

export type AiOverlordTauntCreator = (
  opponent: AiOverlordOpponent
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
) => TE.TaskEither<string, AiOverlordOpponentMoveWithTextAndOutcome>;

export type AiOverlordFinalSummaryTextCreator = (
  aiOverlordGame: AiOverlordGame
) => TE.TaskEither<string, TranslatedText>;

export type AiOverlordGame = {
  gameId: string;
  opponents: AiOverlordOpponent[];
  aiOverlord: AiOverlord;
  taunts: AiOverlordTaunt[];
  opponentMoves: AiOverlordOpponentMove[];
  currentOpponentId?: string;
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
  interests: string;
};

export type AiOverlordOpponentMove = {
  playerId: string;
  move: RPSMoveName;
};

export type AiOverlordOpponentMoveWithTextAndOutcome = {
  opponentId: string;
  move: RPSMoveName;
  text: TranslatedText;
  outcome: AiOverlordOpponentResult;
};

export type AiOverlord = {
  initialised: boolean;
  introduction: TranslatedText;
  finalSummary?: TranslatedText;
  moves: AiOverlordOpponentMoveWithTextAndOutcome[];
};

export type AiOverlordBattle = {
  playerId: string;
  aiTaunt: string;
  aiMove?: RPSMoveName;
};
