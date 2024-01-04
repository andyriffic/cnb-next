import styled from "styled-components";
import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { SmallHeading } from "../Atoms";
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
  { from: 1, to: 5, title: "Very close" },
  { from: 6, to: 10, title: "Pretty good" },
  { from: 11, to: 30, title: "Needs help" },
  { from: 31, to: 50, title: "Not the best" },
  { from: 51, to: 100, title: "Waaaay off" },
];

type Props = {
  game: NumberCrunchGameView;
};

export const getNumberCrunchRangeBucket = (offBy: number) => {
  return BUCKET_RANGES.find((bucket) => {
    return offBy >= bucket.from && offBy <= bucket.to;
  });
};

export const RoundResultBuckets = ({ game }: Props) => {
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
        <RoundContainer>
          <RoundTitle>Round 1</RoundTitle>

          {BUCKET_RANGES.map((bucket, i) => {
            return (
              <CellContainer key={i}>
                <div style={{ display: "flex" }}>
                  {game.currentRound.playerGuesses
                    .filter(
                      (guess) =>
                        guess.offBy >= bucket.from && guess.offBy <= bucket.to
                    )
                    .map((guess, i) => {
                      return (
                        <PlayerAvatar
                          key={i}
                          playerId={guess.playerId}
                          size="thumbnail"
                        />
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
