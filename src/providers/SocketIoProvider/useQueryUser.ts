import { useCallback, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {
  AnswerPlayerQuestion,
  CreatePlayerQuestion,
  DeletePlayerQuestion,
  PLAYER_QUESTION_ACTIONS,
} from "../../services/query-user/socket.io";
import {
  QueryUserQuestion,
  QuestionsByPlayerId,
} from "../../services/query-user/types";

export type PlayerQuerySocketService = {
  questionsByPlayerId: QuestionsByPlayerId;
  createPlayerQuestion: CreatePlayerQuestion;
  deletePlayerQuestion: DeletePlayerQuestion;
  answerPlayerQuestion: AnswerPlayerQuestion;
};

export function usePlayerQuery(socket: Socket): PlayerQuerySocketService {
  const [questionsByPlayerId, setQuestionsByPlayerId] =
    useState<QuestionsByPlayerId>({});

  const createPlayerQuestion = useCallback<CreatePlayerQuestion>(
    (playerId, question, onCreated) =>
      socket.emit(
        PLAYER_QUESTION_ACTIONS.CREATE_QUESTION_FOR_PLAYER,
        playerId,
        question,
        onCreated
      ),
    [socket]
  );

  const deletePlayerQuestion = useCallback<DeletePlayerQuestion>(
    (playerId) =>
      socket.emit(PLAYER_QUESTION_ACTIONS.DELETE_QUESTION_FOR_PLAYER, playerId),
    [socket]
  );

  const answerPlayerQuestion = useCallback<AnswerPlayerQuestion>(
    (playerId, questionId, answerIndex) =>
      socket.emit(
        PLAYER_QUESTION_ACTIONS.ANSWER_QUESTION_FOR_PLAYER,
        playerId,
        questionId,
        answerIndex
      ),
    [socket]
  );

  useEffect(() => {
    console.log("Setting up Player Query socket connection");
    socket.on(
      PLAYER_QUESTION_ACTIONS.QUESTION_UPDATE,
      (questionsByPlayerId: QuestionsByPlayerId) => {
        console.log("Question Update", questionsByPlayerId);
        setQuestionsByPlayerId(questionsByPlayerId);
      }
    );

    return () => {
      console.log("Disconnecting User Query Socket");
      socket.off(PLAYER_QUESTION_ACTIONS.QUESTION_UPDATE);
    };
  }, [socket]);

  return {
    questionsByPlayerId,
    createPlayerQuestion,
    deletePlayerQuestion,
    answerPlayerQuestion,
  };
}
