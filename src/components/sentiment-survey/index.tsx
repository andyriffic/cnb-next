import { useEffect, useRef, useState } from "react";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { QueryUserQuestion } from "../../services/query-user/types";
import { Card, SubHeading } from "../Atoms";
import { DialogModal } from "../DialogModal";
import { AnswerPercentages } from "./AnswerPercentages";

export const SENTIMENT_QUESTION: QueryUserQuestion = {
  id: "sentiment",
  question: "How do you feel after playing this game?",
  style: "emoji",
  options: [
    { text: "😢", value: "sad" },
    { text: "😐", value: "ok" },
    { text: "😁", value: "happy" },
  ],
};

type Props = {
  playerIds: string[];
};

export const SentimentSurvey = ({ playerIds }: Props) => {
  const { playerQuery } = useSocketIo();
  const sentSurvey = useRef(false);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (sentSurvey.current) return;

    playerIds.forEach((playerId) => {
      playerQuery.createPlayerQuestion(playerId, SENTIMENT_QUESTION);
    });
    sentSurvey.current = true;
  }, [playerIds, playerQuery]);

  const totalResponses = Object.values(playerQuery.questionsByPlayerId).filter(
    (q) => q.selectedOptionIndex !== undefined
  ).length;

  const responsePercentages = SENTIMENT_QUESTION.options.map((o, i) => {
    const totalAnswersToQuestion = Object.values(
      playerQuery.questionsByPlayerId
    ).filter((q) => q.selectedOptionIndex === i).length;
    return totalAnswersToQuestion / totalResponses;
  });

  return (
    <DialogModal
      show={showModal}
      options={[
        {
          text: "Done",
          onSelected: () => {
            playerIds.forEach((playerId) => {
              playerQuery.deletePlayerQuestion(playerId);
            });
            setShowModal(false);
          },
        },
      ]}
    >
      <AnswerPercentages
        question={SENTIMENT_QUESTION}
        questionsByPlayerId={playerQuery.questionsByPlayerId}
      />
    </DialogModal>
  );
};
