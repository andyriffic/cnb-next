import styled from "styled-components";
import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { Pill, SmallHeading } from "../Atoms";
import { PlayerAvatar } from "../PlayerAvatar";
import THEME from "../../themes/types";

const BucketContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const RoundContainer = styled.div`
  border-radius: 1rem;
  background: ${THEME.colours.secondaryBackground};
  padding: 1rem;
`;

const RoundTitle = styled.div``;

const CellContainer = styled.div`
  height: 10vh;
`;

const BUCKET_RANGES = [
  { from: 0, to: 0, title: "Spot on!" },
  { from: 1, to: 5, title: "Within 5" },
  { from: 6, to: 10, title: "Within 10" },
  { from: 11, to: 30, title: "Within 30" },
  { from: 31, to: 50, title: "Within 50" },
  { from: 51, to: 100, title: "Over 50" },
];

type Props = {
  gameView: NumberCrunchGameView;
};

export const getNumberCrunchRangeBucket = (offBy: number) => {
  return BUCKET_RANGES.find((bucket) => {
    return offBy >= bucket.from && offBy <= bucket.to;
  });
};

export const RoundResultBuckets = ({ gameView }: Props) => {
  return (
    <div>
      <BucketContainer>
        <RoundContainer>
          <RoundTitle>&nbsp;</RoundTitle>
          {BUCKET_RANGES.map((bucket, i) => {
            return (
              <CellContainer key={i}>
                <SmallHeading>{bucket.title}</SmallHeading>
              </CellContainer>
            );
          })}
        </RoundContainer>
        {gameView.previousRounds.map((round, i) => {
          return (
            <RoundContainer key={i}>
              <RoundTitle>Round {i + 1}</RoundTitle>

              {BUCKET_RANGES.map((bucket, i) => {
                return (
                  <CellContainer key={i}>
                    <div style={{ display: "flex" }}>
                      {round.playerGuesses
                        .filter(
                          (guess) =>
                            guess.offBy >= bucket.from &&
                            guess.offBy <= bucket.to
                        )
                        .map((guess, i) => {
                          return (
                            <div key={i}>
                              <Pill>{guess.playerId}</Pill>{" "}
                            </div>
                          );
                        })}
                    </div>
                  </CellContainer>
                );
              })}
            </RoundContainer>
          );
        })}
        <RoundContainer>
          <RoundTitle>Round {gameView.roundNumber}</RoundTitle>

          {BUCKET_RANGES.map((bucket, i) => {
            return (
              <CellContainer key={i} style={{ paddingRight: "3vh" }}>
                <div style={{ display: "flex" }}>
                  {gameView.currentRound.playerGuesses
                    .filter(
                      (guess) =>
                        guess.offBy >= bucket.from && guess.offBy <= bucket.to
                    )
                    .map((guess, i) => {
                      return (
                        <div key={i} style={{ width: "3vh" }}>
                          <PlayerAvatar
                            playerId={guess.playerId}
                            size="thumbnail"
                          />{" "}
                        </div>
                      );
                    })}
                </div>
              </CellContainer>
            );
          })}
        </RoundContainer>
      </BucketContainer>
    </div>
  );
};
