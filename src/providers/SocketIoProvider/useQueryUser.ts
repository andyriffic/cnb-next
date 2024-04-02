import { useCallback, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {
  AnswerPlayerQuestion,
  CreatePlayerQuestion,
  PLAYER_QUESTION_ACTIONS,
} from "../../services/query-user/socket.io";
import {
  QueryUserQuestion,
  QuestionsByPlayerId,
} from "../../services/query-user/types";

export type PlayerQuerySocketService = {
  questionsByPlayerId: QuestionsByPlayerId;
  createPlayerQuestion: CreatePlayerQuestion;
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

  const answerPlayerQuestion = useCallback<AnswerPlayerQuestion>(
    (playerId, questionId, answerId) =>
      socket.emit(
        PLAYER_QUESTION_ACTIONS.ANSWER_QUESTION_FOR_PLAYER,
        playerId,
        questionId,
        answerId
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
    answerPlayerQuestion,
  };
}

// Helper for individual betting game
// export function useBettingGame(gameId: string): {
//   bettingGame: GroupBettingGame | undefined;
//   makePlayerBet: (playerBet: PlayerBet) => void;
//   resolveBettingRound: (winningOptionId: string) => void;
//   newBettingRound: () => void;
// } {
//   const {
//     groupBetting: {
//       bettingGames,
//       makePlayerBet,
//       resolveBettingRound,
//       addNewBettingRound,
//     },
//   } = useSocketIo();

//   const bettingGame = useMemo(() => {
//     return bettingGames.find((g) => g.id === gameId);
//   }, [gameId, bettingGames]);

//   const makeBet = useCallback(
//     (playerBet: PlayerBet) => {
//       return makePlayerBet(gameId, playerBet);
//     },
//     [gameId, makePlayerBet]
//   );

//   const resolveRound = useCallback(
//     (winningOptionId: string) => {
//       return resolveBettingRound(gameId, winningOptionId);
//     },
//     [gameId, resolveBettingRound]
//   );

//   const newRound = useCallback(() => {
//     return addNewBettingRound(gameId);
//   }, [gameId, addNewBettingRound]);

//   return {
//     bettingGame,
//     makePlayerBet: makeBet,
//     resolveBettingRound: resolveRound,
//     newBettingRound: newRound,
//   };
// }
