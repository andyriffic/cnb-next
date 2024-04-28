import styled from "styled-components";
import {
  QueryUserQuestion,
  QuestionsByPlayerId,
} from "../../services/query-user/types";
import { SmallHeading, SubHeading } from "../Atoms";

const AnswerList = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const AnswerListItem = styled.div`
  text-align: center;
  margin: 1rem 0;
`;

const AnswerEmoji = styled.div`
  font-size: 3rem;
  padding: 1rem;
`;

type Props = {
  question: QueryUserQuestion<string | number>;
  questionsByPlayerId: QuestionsByPlayerId;
};

export const AnswerPercentages = ({ question, questionsByPlayerId }: Props) => {
  const totalRespondants = Object.values(questionsByPlayerId).length;

  const totalResponses = Object.values(questionsByPlayerId).filter(
    (q) => q.selectedOptionIndex !== undefined
  ).length;

  const responsePercentages = question.options.map((o, i) => {
    const totalAnswersToQuestion = Object.values(questionsByPlayerId).filter(
      (q) => q.selectedOptionIndex === i
    ).length;
    return totalResponses > 0
      ? Math.floor((totalAnswersToQuestion / totalResponses) * 100)
      : 0;
  });

  return (
    <>
      <SmallHeading>{question.question}</SmallHeading>
      <p style={{ fontSize: "0.8rem" }}>
        Total responses: {totalResponses}/{totalRespondants}
      </p>
      <AnswerList>
        {responsePercentages.map((percentage, i) => {
          const answer = question.options[i];
          if (!answer) return null;
          return (
            <AnswerListItem key={i}>
              <AnswerEmoji>{answer.text}</AnswerEmoji>
              {percentage}%
            </AnswerListItem>
          );
        })}
      </AnswerList>
    </>
  );
};
