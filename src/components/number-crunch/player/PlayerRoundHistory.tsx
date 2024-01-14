import styled from "styled-components";
import { useMemo } from "react";
import { NumberCrunchGameView } from "../../../services/number-crunch/types";
import { NUMBER_CRUNCH_BUCKET_RANGES } from "../../../services/number-crunch";

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
        <div>
          {NUMBER_CRUNCH_BUCKET_RANGES[currentGuess.bucketRangeIndex]?.title}
        </div>
      )}
    </Container>
  );
};
