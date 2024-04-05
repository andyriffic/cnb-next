import { useEffect, useRef, useState } from "react";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { QueryUserQuestion } from "../../services/query-user/types";
import { Card, SubHeading } from "../Atoms";
import { DialogModal } from "../DialogModal";

const SENTIMENT_QUESTION: QueryUserQuestion = {
  id: "sentiment",
  question: "How are you feeling today?",
  style: "normal",
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
            setShowModal(false);
            //TODO: delete question for all player ids
          },
        },
      ]}
    >
      <>
        <SubHeading>{SENTIMENT_QUESTION.question}</SubHeading>
        <p>Total responses: {totalResponses}</p>
        <div>
          {responsePercentages.map((percentage, i) => {
            const question = SENTIMENT_QUESTION.options[i];
            if (!question) return null;
            return (
              <div key={i}>
                {question.text}: {percentage * 100}%
              </div>
            );
          })}
        </div>
      </>
    </DialogModal>
  );
};
