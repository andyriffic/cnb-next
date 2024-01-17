import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { SmallHeading } from "../Atoms";

type Props = {
  game: NumberCrunchGameView;
};

export const NumberTarget = ({ game }: Props) => {
  return (
    <SmallHeading style={{ textAlign: "center" }}>
      Guess the number from {game.currentRound.range.low} -{" "}
      {game.currentRound.range.high}
    </SmallHeading>
  );
};
