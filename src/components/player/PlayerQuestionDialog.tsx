import { useMemo } from "react";
import styled from "styled-components";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { FeatureSubHeading, SmallHeading, SubHeading } from "../Atoms";
import { DialogModal } from "../DialogModal";

const QuestionOptionsContainer = styled.div<{ stack: boolean }>`
  display: flex;
  margin: 1rem 0;
  gap: 1rem;
  flex-direction: ${({ stack }) => (stack ? "column" : "row")};
  flex-wrap: wrap;
`;

const QuestionOptionButton = styled.button`
  padding: 1rem;
  font-size: 2rem;
`;

type Props = {
  playerId: string;
};

export const PlayerQuestionDialog = ({ playerId }: Props) => {
  const { playerQuery } = useSocketIo();

  // const [showModal, setShowModal] = useState(false);

  const activePlayerQuestion = useMemo(() => {
    return playerQuery.questionsByPlayerId[playerId];
  }, [playerId, playerQuery.questionsByPlayerId]);

  // useEffect(() => {
  //   const localPlayerSettings = getPlayerLocalStorageSettings();
  //   if (localPlayerSettings?.playerId) {
  //     setShowModal(true);
  //   }
  // }, [showModal]);

  if (!activePlayerQuestion) {
    return null;
  }

  return (
    <DialogModal show={activePlayerQuestion.selectedOptionIndex === undefined}>
      <div style={{ width: "90vw" }}>
        <SmallHeading>{activePlayerQuestion.question}</SmallHeading>
        <QuestionOptionsContainer
          stack={activePlayerQuestion.style !== "emoji"}
        >
          {activePlayerQuestion.options.map((option, i) => (
            <QuestionOptionButton
              key={option.value}
              onClick={() => {
                playerQuery.answerPlayerQuestion(
                  playerId,
                  activePlayerQuestion.id,
                  i
                );
              }}
            >
              {option.text}
            </QuestionOptionButton>
          ))}
        </QuestionOptionsContainer>
      </div>
    </DialogModal>
  );
};
