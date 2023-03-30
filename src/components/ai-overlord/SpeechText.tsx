import styled from "styled-components";
import { TranslatedText } from "../../services/ai-overlord/types";

const SpeechBubble = styled.div`
  background: white;
  border-radius: 1rem;
  border: 2px solid black;
  padding: 1rem;
`;

const Text = styled.div``;

type Props = {
  text: TranslatedText;
};

export const SpeechText = ({ text }: Props) => {
  return (
    <SpeechBubble>
      <Text>{text.english}</Text>
    </SpeechBubble>
  );
};
