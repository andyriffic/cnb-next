import styled from "styled-components";
import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { SmallHeading } from "../Atoms";

const Container = styled.div`
  margin: 2rem 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const Indicator = styled.div`
  font-size: 3rem;
`;

type Props = {
  gameView: NumberCrunchGameView;
};

export const NumbersRemainingIndicator = ({ gameView }: Props) => {
  const elementMap = Array.from(
    { length: gameView.currentRound.range.high },
    (_, index) => index + 1
  );
  return (
    <Container>
      {elementMap.map((element) => {
        const hidden = gameView.guessedNumbers.includes(element);
        return <Indicator key={element}>{hidden ? "🧧" : "🥟"}</Indicator>;
      })}
    </Container>
  );
};
