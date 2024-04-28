import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";
import { SmallHeading } from "../components/Atoms";
import { SpectatorPageLayout } from "../components/SpectatorPageLayout";
import { AnswerPercentages } from "../components/sentiment-survey/AnswerPercentages";
import { useSocketIo } from "../providers/SocketIoProvider";
import {
  QueryUserQuestion,
  QuestionsByPlayerId,
} from "../services/query-user/types";
import { SENTIMENT_QUESTION } from "../components/sentiment-survey";

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

const testPlayerIds: string[] = ["andy", "alex", "albert_s"];

const PlayersQuestions = ({
  playerId,
  question,
  onAnswer,
}: {
  playerId: string;
  question: QueryUserQuestion<string | number>;
  onAnswer: (playerId: string, questionId: string, optionIndex: number) => void;
}) => {
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
  onDelete,
}: {
  questionsByPlayerId: QuestionsByPlayerId;
  onDelete: (playerId: string) => void;
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
            {playerAnswer?.value}){" "}
            <button onClick={() => onDelete(playerId)}>X</button>
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
          onDelete={playerQuery.deletePlayerQuestion}
        />
        <form>
          <button
            id="create_question"
            type="button"
            onClick={() => {
              testPlayerIds.forEach((playerId) => {
                playerQuery.createPlayerQuestion(playerId, SENTIMENT_QUESTION);
              });
            }}
          >
            Create question
          </button>
        </form>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {Object.keys(playerQuery.questionsByPlayerId).map((playerId) => {
            const question = playerQuery.questionsByPlayerId[playerId];

            if (!question) return null;

            return (
              <div key={playerId}>
                <PlayersQuestions
                  playerId={playerId}
                  question={question}
                  onAnswer={playerQuery.answerPlayerQuestion}
                />
              </div>
            );
          })}
        </div>
      </UiSection>
      <UiSection>
        <UiSectionHeading>Percentages</UiSectionHeading>
        <AnswerPercentages
          question={SENTIMENT_QUESTION}
          questionsByPlayerId={playerQuery.questionsByPlayerId}
        />
      </UiSection>
      {/* <SentimentSurvey playerIds={["andy", "alex"]} /> */}
    </SpectatorPageLayout>
  );
};

export default Screen;
