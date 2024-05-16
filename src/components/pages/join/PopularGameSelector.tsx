import styled from "styled-components";
import {
  QueryUserQuestion,
  QuestionsByPlayerId,
} from "../../../services/query-user/types";
import { SmallHeading } from "../../Atoms";
import { GameTypes } from "../../../pages/join/[groupId]";
import { PressableButton } from "../../migrated/gas-out/play/PressableButton";

const AnswerList = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const AnswerListItem = styled.div`
  text-align: center;
  margin: 1rem 0;
`;

const GameNameText = styled.div`
  font-size: 1rem;
  padding: 1rem;
`;

const PercentageText = styled.div``;

const GameSelectButton = styled.button`
  font-size: 1rem;
`;

type Props = {
  question: QueryUserQuestion<GameTypes>;
  questionsByPlayerId: QuestionsByPlayerId;
  onGameSelected: (gameType: GameTypes) => void;
};

export const PopularGameSelector = ({
  question,
  questionsByPlayerId,
  onGameSelected,
}: Props) => {
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

  const everyoneAnswered = totalResponses === totalRespondants;
  const highestPercentage = Math.max(...responsePercentages);

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
              <GameNameText>{answer.text}</GameNameText>
              <PercentageText>
                {everyoneAnswered ? <>{percentage}%</> : <>🙈</>}{" "}
              </PercentageText>
              <GameSelectButton
                onClick={() => onGameSelected(answer.value)}
                disabled={
                  !(everyoneAnswered && highestPercentage === percentage)
                }
              >
                play
              </GameSelectButton>
            </AnswerListItem>
          );
        })}
      </AnswerList>
    </>
  );
};
