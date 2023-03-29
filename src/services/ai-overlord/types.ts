import * as TE from "fp-ts/TaskEither";
import { RPSMoveName } from "../rock-paper-scissors/types";

export type AiOverlordCreator = () => TE.TaskEither<string, AiOverlord>;

export type AiOverlordGame = {
  gameId: string;
  opponents: AiOverlordOpponent[];
  aiOverlord: AiOverlord;
};

export type AiOverlordOpponentResult = "win" | "lose" | "draw";

export type AiOverlordOpponent = {
  playerId: string;
  name: string;
  occupation: string;
  move?: RPSMoveName;
  aiMove?: RPSMoveName;
  result?: AiOverlordOpponentResult;
};

export type AiOverlord = {
  introduction: string;
  battles: AiOverlordBattle[];
};

export type AiOverlordBattle = {
  playerId: string;
  aiMove?: RPSMoveName;
};
