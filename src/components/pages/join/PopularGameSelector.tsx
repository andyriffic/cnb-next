import styled from "styled-components";
import { GameTypes } from "../../../pages/join/[groupId]";
import { usePlayerNames } from "../../../providers/PlayerNamesProvider";
import {
  QueryUserQuestion,
  QuestionsByPlayerId,
} from "../../../services/query-user/types";
import { Pill, SmallHeading } from "../../Atoms";
import { CenterSpaced } from "../../Layouts";

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

const PlayerNameList = styled.div``;

const PlayerName = styled(Pill)`
  font-size: 1rem;
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
  const { getName } = usePlayerNames();
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
      <p style={{ fontSize: "0.8rem", margin: "1rem 0" }}>
        Total responses: {totalResponses}/{totalRespondants}
      </p>
      <CenterSpaced style={{ flexWrap: "wrap" }}>
        {Object.keys(questionsByPlayerId).map((playerId) => {
          const hasVoted =
            questionsByPlayerId[playerId]?.selectedOptionIndex !== undefined;
          return (
            <PlayerName
              key={playerId}
              style={{ backgroundColor: hasVoted ? "green" : "crimson" }}
            >
              {getName(playerId)}
            </PlayerName>
          );
        })}
      </CenterSpaced>
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
