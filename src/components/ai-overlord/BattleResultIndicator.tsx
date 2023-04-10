import styled from "styled-components";
import { AiOverlordOpponentResult } from "../../services/ai-overlord/types";

const Container = styled.div`
  background: goldenrod;
  border-radius: 1rem;
  border: 2px solid black;
  padding: 0.1rem;
  color: black;
`;

const Text = styled.p`
  font-size: 1rem;
  padding: 0.5rem;
`;

type Props = {
  result: AiOverlordOpponentResult;
};

const RESULT_STYLES: {
  [key in AiOverlordOpponentResult]: { text: string; backgroundColor: string };
} = {
  win: {
    text: "👎",
    backgroundColor: "red",
  },
  lose: {
    text: "👍",
    backgroundColor: "green",
  },
  draw: {
    text: "✊",
    backgroundColor: "darkgrey",
  },
};

export const BattleResultIndicator = ({ result }: Props) => {
  return (
    <Container
      style={{ backgroundColor: RESULT_STYLES[result].backgroundColor }}
    >
      <Text>{RESULT_STYLES[result].text}</Text>
    </Container>
  );
};
