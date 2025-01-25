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
  const player = useMemo(() => {
    return game.players.find((player) => player.id === playerId);
  }, [game.players, playerId]);

  const currentGuess = useMemo(() => {
    return game.currentRound.playerGuesses.find(
      (guess) => guess.playerId === playerId
    );
  }, [game.currentRound.playerGuesses, playerId]);

  if (!player) {
    return (
      <div>
        Sorry, there is no player with id {playerId} in this game of Number
        Crunch
      </div>
    );
  }

  return (
    <PlayerPageLayout playerId={playerId}>
      {/* <SmallHeading>{playerId}</SmallHeading> */}
      {currentGuess ? (
        <SmallHeading>Waiting to Guess</SmallHeading>
      ) : (
        <PlayerSelectNumber
          game={game}
          hint={player.extraHint}
          onSelected={(val) => makePlayerGuess(val)}
        />
      )}
      {player?.advantage && (
        <PlayerRoundHistory game={game} playerId={playerId} />
      )}
    </PlayerPageLayout>
  );
};

export default View;
