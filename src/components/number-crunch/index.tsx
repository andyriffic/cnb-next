import { useState } from "react";
import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { DebugNumberCrunchGame } from "./DebugNumberCrunch";
import { FinalResults } from "./FinalResults";
import { NumberTarget } from "./NumberTarget";
import { RoundResultBuckets } from "./RoundResultBuckets";
import { WaitingToGuessList } from "./WaitingToGuessList";

type Props = {
  game: NumberCrunchGameView;
};

const View = ({ game }: Props) => {
  const [revealWinner, setRevealWinner] = useState(false);
  const { numberCrunch } = useSocketIo();
  return (
    <SpectatorPageLayout debug={<DebugNumberCrunchGame game={game} />}>
      {!revealWinner && (
        <>
          <NumberTarget game={game} />
          <WaitingToGuessList game={game} />
          <RoundResultBuckets
            gameView={game}
            onRoundRevealed={() => {
              if (game.finalResults) {
                setTimeout(() => setRevealWinner(true), 2000);
              } else {
                setTimeout(() => numberCrunch.newRound(game.id), 2000);
              }
            }}
          />
        </>
      )}

      {game.finalResults && revealWinner && (
        <FinalResults gameView={game} finalResults={game.finalResults} />
      )}
    </SpectatorPageLayout>
  );
};

export default View;
