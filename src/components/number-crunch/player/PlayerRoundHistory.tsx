import styled from "styled-components";
import { useMemo } from "react";
import {
  NumberCrunchGameView,
  NumberCrunchPlayerGuessView,
} from "../../../services/number-crunch/types";
import { NUMBER_CRUNCH_BUCKET_RANGES } from "../../../services/number-crunch";

const Container = styled.div`
  margin-bottom: 3rem;
`;

type Props = {
  game: NumberCrunchGameView;
  playerId: string;
};

export const PlayerRoundHistory = ({ game, playerId }: Props) => {
  const playerHistory = useMemo(() => {
    return game.previousRounds.flatMap((round) => {
      return round.playerGuesses.filter((guess) => {
        return guess.playerId === playerId;
      });
    });
  }, [game.previousRounds, playerId]);

  return (
    <Container>
      {playerHistory.map((guess, i) => {
        return (
          <div key={i}>
            {NUMBER_CRUNCH_BUCKET_RANGES[guess.bucketRangeIndex]?.title} -{" "}
            {guess.guess}
          </div>
        );
      })}
      {/* {currentGuess && (
        <div>
          {NUMBER_CRUNCH_BUCKET_RANGES[currentGuess.bucketRangeIndex]?.title}
        </div>
      )} */}
    </Container>
  );
};
