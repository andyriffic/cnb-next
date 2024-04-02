import { Socket, Server as SocketIOServer } from "socket.io";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { sendClientMessage } from "../socket";
import { QueryUserQuestion, QuestionsByPlayerId } from "./types";

export enum PLAYER_QUESTION_ACTIONS {
  QUESTION_UPDATE = "PLAYER_QUESTION_ACTIONS_QUESTION_UPDATE",
  CREATE_QUESTION_FOR_PLAYER = "PLAYER_QUESTION_ACTIONS_CREATE_QUESTION_FOR_PLAYER",
  ANSWER_QUESTION_FOR_PLAYER = "PLAYER_QUESTION_ACTIONS_ANSWER_QUESTION_FOR_PLAYER",
}

export type CreatePlayerQuestion = (
  playerId: string,
  question: QueryUserQuestion<string | number>,
  onCreated?: (questionId: string) => void
) => void;

export type AnswerPlayerQuestion = (
  playerId: string,
  questionId: string,
  answerIndex: number
) => void;

// export type PlayerJoinGroupSocketHandler = (
//   playerId: string,
//   groupId: string,
//   onJoined?: (groupId: string) => void
// ) => void;

function getPlayerRoomId(playerId: string): string {
  return `player_question_room:${playerId}`;
}

let inMemoryQuestionsByPlayerId: QuestionsByPlayerId = {};

export function initialisePlayerQuestionSocket(
  io: SocketIOServer,
  socket: Socket
): void {
  const createPlayerQuestionHandler: CreatePlayerQuestion = (
    playerId,
    question,
    onCreated?
  ) => {
    inMemoryQuestionsByPlayerId[playerId] = question;
    // socket
    //   .to(getPlayerRoomId(playerId))
    //   .emit(PLAYER_QUESTION_ACTIONS.QUESTION_UPDATE, question);

    io.emit(
      PLAYER_QUESTION_ACTIONS.QUESTION_UPDATE,
      inMemoryQuestionsByPlayerId
    );

    onCreated && onCreated(question.id);
  };

  const answerPlayerQuestionHandler: AnswerPlayerQuestion = (
    playerId,
    questionId,
    answerIndex
  ) => {
    const question = inMemoryQuestionsByPlayerId[playerId];
    if (!question) {
      return;
    }
    if (question.id !== questionId) {
      return;
    }

    const answer = question.options[answerIndex];

    if (!answer) {
      return;
    }

    inMemoryQuestionsByPlayerId[playerId] = {
      ...question,
      selectedOptionIndex: answerIndex,
    };
    // socket
    //   .to(getPlayerRoomId(playerId))
    //   .emit(
    //     PLAYER_QUESTION_ACTIONS.QUESTION_UPDATE,
    //     inMemoryQuestionsByPlayerId[playerId]
    //   );

    io.emit(
      PLAYER_QUESTION_ACTIONS.QUESTION_UPDATE,
      inMemoryQuestionsByPlayerId
    );
  };

  console.log("Registering Player Question SocketIo 🔌");

  socket.on(
    PLAYER_QUESTION_ACTIONS.CREATE_QUESTION_FOR_PLAYER,
    createPlayerQuestionHandler
  );
  socket.on(
    PLAYER_QUESTION_ACTIONS.ANSWER_QUESTION_FOR_PLAYER,
    answerPlayerQuestionHandler
  );

  socket.emit(
    PLAYER_QUESTION_ACTIONS.QUESTION_UPDATE,
    inMemoryQuestionsByPlayerId
  );
  sendClientMessage(socket, "Welcome to Player Question service ❓");
}
