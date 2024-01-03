import styled from "styled-components";
import { useMemo } from "react";
import { NumberCrunchGameView } from "../../../services/number-crunch/types";
import { getNumberCrunchRangeBucket } from "../RoundResultBuckets";

const Container = styled.div`
  margin-bottom: 3rem;
`;

type Props = {
  game: NumberCrunchGameView;
  playerId: string;
};

export const PlayerRoundHistory = ({ game, playerId }: Props) => {
  const currentGuess = useMemo(() => {
    return game.currentRound.playerGuesses.find(
      (guess) => guess.playerId === playerId
    );
  }, [game.currentRound.playerGuesses, playerId]);

  return (
    <Container>
      {currentGuess && (
        <div>{getNumberCrunchRangeBucket(currentGuess.offBy)?.title}</div>
      )}
      <div></div>
    </Container>
  );
};
