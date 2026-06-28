import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { SmallHeading } from "../Atoms";
import { ElevatorResultsBuckets } from "./ElevatorResultsBuckets";
import { NUMBER_CRUNCH_GAME_STATE } from "./hooks/useNumberCrunchGameTiming";

type Props = {
  gameView: NumberCrunchGameView;
  gameState: NUMBER_CRUNCH_GAME_STATE;
  onRoundRevealed: () => void;
};

export const ElevatorResults = ({
  gameView,
  gameState,
  onRoundRevealed,
}: Props) => {
  return (
    <div>
      <SmallHeading style={{ textAlign: "center" }}>
        Elevator Results
      </SmallHeading>
      <ElevatorResultsBuckets
        gameView={gameView}
        gameState={gameState}
        onRoundRevealed={onRoundRevealed}
      />
    </div>
  );
};
