import styled from "styled-components";
import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { SmallHeading } from "../Atoms";
import bannerBg from "./assets/dog-race-baner-bg.png";

const Container = styled.div`
  background: url(${bannerBg.src}) repeat center center;
  padding: 2rem;
  margin: 0;
`;

const NumberHighlight = styled.span`
  font-weight: bold;
  color: #ffde62;
`;

type Props = {
  game: NumberCrunchGameView;
};

export const NumberTarget = ({ game }: Props) => {
  return (
    <Container>
      <SmallHeading style={{ textAlign: "center", padding: "0", margin: "0" }}>
        Find the number between{" "}
        <NumberHighlight>{game.currentRound.range.low}</NumberHighlight> and{" "}
        <NumberHighlight>{game.currentRound.range.high}</NumberHighlight> to win
        the race!
      </SmallHeading>
    </Container>
  );
};
