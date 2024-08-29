import { useMemo } from "react";
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
  const currentGuess = useMemo(() => {
    return game.currentRound.playerGuesses.find(
      (guess) => guess.playerId === playerId
    );
  }, [game.currentRound.playerGuesses, playerId]);

  return (
    <PlayerPageLayout playerId={playerId}>
      {/* <SmallHeading>{playerId}</SmallHeading> */}
      {currentGuess ? (
        <SmallHeading>Waiting to Guess</SmallHeading>
      ) : (
        <PlayerSelectNumber
          game={game}
          playerId={playerId}
          onSelected={(val) => makePlayerGuess(val)}
        />
      )}
      {/* <PlayerRoundHistory game={game} playerId={playerId} /> */}
    </PlayerPageLayout>
  );
};

export default View;
