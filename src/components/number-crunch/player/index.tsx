import { NumberCrunchGameView } from "../../../services/number-crunch/types";
import { SmallHeading } from "../../Atoms";
import { PlayerPageLayout } from "../../PlayerPageLayout";
import { PlayerRoundHistory } from "./PlayerRoundHistory";
import { PlayerSelectNumber } from "./PlayerSelectNumber";

type Props = {
  game: NumberCrunchGameView;
  playerId: string;
  makePlayerGuess: (guess: number) => void;
};

const View = ({ game, playerId, makePlayerGuess }: Props) => {
  return (
    <PlayerPageLayout playerId={playerId}>
      <SmallHeading>{playerId}</SmallHeading>
      <PlayerRoundHistory game={game} playerId={playerId} />
      <PlayerSelectNumber
        game={game}
        playerId={playerId}
        onSelected={(val) => makePlayerGuess(val)}
      />
    </PlayerPageLayout>
  );
};

export default View;
