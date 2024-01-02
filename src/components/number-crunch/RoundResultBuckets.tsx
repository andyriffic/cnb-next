import styled from "styled-components";
import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { SmallHeading } from "../Atoms";
import { PlayerAvatar } from "../PlayerAvatar";

const BucketContainer = styled.div`
  margin-bottom: 3rem;
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

export const RoundResultBuckets = ({ game }: Props) => {
  return (
    <div>
      {BUCKET_RANGES.map((bucket, i) => {
        return (
          <BucketContainer key={i}>
            <SmallHeading>{bucket.title}</SmallHeading>
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
          </BucketContainer>
        );
      })}
    </div>
  );
};
