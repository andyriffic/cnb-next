import { useMemo } from "react";
import styled from "styled-components";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { FeatureSubHeading, SmallHeading, SubHeading } from "../Atoms";
import { DialogModal } from "../DialogModal";

const QuestionOptionsContainer = styled.div`
  display: flex;
  margin: 1rem 0;
  gap: 1rem;
  flex-direction: column;
`;
const QuestionOptionButton = styled.button`
  padding: 1rem;
  font-size: 1.5rem;
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
      <SmallHeading>{activePlayerQuestion.question}</SmallHeading>
      <QuestionOptionsContainer>
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
    </DialogModal>
  );
};