import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";
import { SmallHeading } from "../components/Atoms";
import { SpectatorPageLayout } from "../components/SpectatorPageLayout";
import { useSocketIo } from "../providers/SocketIoProvider";
import {
  QueryUserQuestion,
  QuestionsByPlayerId,
} from "../services/query-user/types";

const UiSection = styled.div`
  padding: 3rem;
`;

const UiSectionHeading = styled(SmallHeading)`
  margin-bottom: 3rem;
`;

const defaultQuestion: QueryUserQuestion<number> = {
  id: "1",
  style: "normal",
  question: "What is your star rating?",
  options: [
    { value: 1, text: "⭐️" },
    { value: 2, text: "⭐️⭐️" },
    { value: 3, text: "⭐️⭐️⭐️" },
    { value: 4, text: "Prefer not to answer" },
  ],
};

const PlayersQuestions = ({
  playerId,
  allQuestions,
  onAnswer,
}: {
  playerId: string;
  allQuestions: QuestionsByPlayerId;
  onAnswer: (playerId: string, questionId: string, optionIndex: number) => void;
}) => {
  const question = allQuestions[playerId];

  return (
    <UiSection>
      <UiSectionHeading>{playerId}</UiSectionHeading>
      <div>
        {question ? (
          <div>
            <h3>{question.question}</h3>
            <div>
              {question.options.map((option, i) => (
                <div key={option.value}>
                  <button onClick={() => onAnswer(playerId, question.id, i)}>
                    {option.text}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>No question</div>
        )}
      </div>
    </UiSection>
  );
};

const PlayerQuestionSummary = ({
  questionsByPlayerId,
}: {
  questionsByPlayerId: QuestionsByPlayerId;
}) => {
  return (
    <UiSection>
      <UiSectionHeading>Question summary</UiSectionHeading>
      {Object.keys(questionsByPlayerId).map((playerId) => {
        const playerQuestion = questionsByPlayerId[playerId];
        if (!playerQuestion) return null;
        const playerAnswer =
          playerQuestion.options[
            playerQuestion.selectedOptionIndex !== undefined
              ? playerQuestion.selectedOptionIndex
              : -1
          ];

        return (
          <div key={playerId}>
            {playerId}: {playerQuestion.question} = {playerAnswer?.text} (
            {playerAnswer?.value})
          </div>
        );
      })}
    </UiSection>
  );
};

const Screen: NextPage = () => {
  const { playerQuery } = useSocketIo();

  return (
    <SpectatorPageLayout>
      <Head>
        <title>User Questions Test</title>
      </Head>
      <UiSection>
        <PlayerQuestionSummary
          questionsByPlayerId={playerQuery.questionsByPlayerId}
        />
        <form>
          <button
            id="create_question"
            type="button"
            onClick={() =>
              playerQuery.createPlayerQuestion("andy", defaultQuestion)
            }
          >
            Create question
          </button>
        </form>
        <div style={{ display: "flex" }}>
          <PlayersQuestions
            playerId="andy"
            allQuestions={playerQuery.questionsByPlayerId}
            onAnswer={playerQuery.answerPlayerQuestion}
          />
          <PlayersQuestions
            playerId="alex"
            allQuestions={playerQuery.questionsByPlayerId}
            onAnswer={playerQuery.answerPlayerQuestion}
          />
        </div>
      </UiSection>
    </SpectatorPageLayout>
  );
};

export default Screen;
