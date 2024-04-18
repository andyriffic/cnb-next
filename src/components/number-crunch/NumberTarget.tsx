import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { SmallHeading } from "../Atoms";

type Props = {
  game: NumberCrunchGameView;
};

export const NumberTarget = ({ game }: Props) => {
  return (
    <SmallHeading style={{ textAlign: "center" }}>
      Find the number between {game.currentRound.range.low} and{" "}
      {game.currentRound.range.high}
    </SmallHeading>
  );
};
