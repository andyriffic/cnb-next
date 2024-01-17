import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { DebugNumberCrunchGame } from "./DebugNumberCrunch";
import { FinalResults } from "./FinalResults";
import { NumberTarget } from "./NumberTarget";
import { RoundResultBuckets } from "./RoundResultBuckets";
import { WaitingToGuessList } from "./WaitingToGuessList";

type Props = {
  game: NumberCrunchGameView;
};

const View = ({ game }: Props) => {
  return (
    <SpectatorPageLayout debug={<DebugNumberCrunchGame game={game} />}>
      {/* <NumberTarget game={game} />
      <WaitingToGuessList game={game} />
      <RoundResultBuckets gameView={game} />
 */}
      {game.finalResults && (
        <FinalResults gameView={game} finalResults={game.finalResults} />
      )}
    </SpectatorPageLayout>
  );
};

export default View;
