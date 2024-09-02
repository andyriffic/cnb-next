import styled from "styled-components";
import { useMemo } from "react";
import {
  NumberCrunchGameView,
  NumberCrunchPlayerGuessView,
} from "../../../services/number-crunch/types";
import { NUMBER_CRUNCH_BUCKET_RANGES } from "../../../services/number-crunch";
import { getOrdinal } from "../../../utils/string";
import { SmallHeading } from "../../Atoms";

const Container = styled.div`
  margin-bottom: 3rem;
`;

const PreviousGuessContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;
`;

const PreviousGuessItemContainer = styled.div`
  display: flex;
  align-items: center;
`;

const GuessRoundNumber = styled.div`
  width: 20%;
  text-align: right;
  padding: 0.5rem;
  font-size: 0.8rem;
`;

const RangeBucket = styled.div`
  color: black;
  padding: 0.5rem;
  width: 30%;
  font-weight: bold;
  color: white;
`;

const GuessValueNumber = styled.div`
  width: 14%;
  text-align: right;
  padding: 0.5rem;
  font-weight: bold;
  color: black;
  font-size: 1.8rem;
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
      <p style={{ marginBottom: "1rem" }}>
        Because you rule a planet, only you can see this section below
      </p>
      <p style={{ marginBottom: "1rem" }}>Dont tell anyone else yet 🤫</p>
      <SmallHeading>Previous Guesses</SmallHeading>
      <PreviousGuessContainer>
        {playerHistory.map((guess, i) => {
          return (
            <PreviousGuessItemContainer key={i}>
              <GuessRoundNumber>{getOrdinal(i + 1)} guess</GuessRoundNumber>
              <GuessValueNumber>{guess.guess}</GuessValueNumber>
              <RangeBucket
                style={{
                  color:
                    NUMBER_CRUNCH_BUCKET_RANGES[guess.bucketRangeIndex]?.color,
                }}
              >
                {NUMBER_CRUNCH_BUCKET_RANGES[guess.bucketRangeIndex]?.title}
              </RangeBucket>
            </PreviousGuessItemContainer>
          );
        })}
      </PreviousGuessContainer>
      {/* {currentGuess && (
        <div>
          {NUMBER_CRUNCH_BUCKET_RANGES[currentGuess.bucketRangeIndex]?.title}
        </div>
      )} */}
    </Container>
  );
};
