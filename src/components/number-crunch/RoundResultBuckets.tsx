import styled from "styled-components";
import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { Pill, SmallHeading } from "../Atoms";
import { PlayerAvatar } from "../PlayerAvatar";
import THEME from "../../themes/types";
import { NUMBER_CRUNCH_BUCKET_RANGES } from "../../services/number-crunch";
import { RevealLatestRoundResultsBucket } from "./RevealLatestRoundResultsBucket";

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
  flex-wrap: wrap;
  /* max-width: 10vh; */
`;

type Props = {
  gameView: NumberCrunchGameView;
};

export const RoundResultBuckets = ({ gameView }: Props) => {
  return (
    <div>
      <BucketContainer>
        <RoundContainer>
          <RoundTitle>&nbsp;</RoundTitle>
          {NUMBER_CRUNCH_BUCKET_RANGES.map((bucket, i) => {
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

              {NUMBER_CRUNCH_BUCKET_RANGES.map((bucket, i) => {
                return (
                  <CellContainer key={i}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.2rem",
                      }}
                    >
                      {round.playerGuesses
                        .filter((guess) => guess.bucketRangeIndex === i)
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
        {/* <RoundContainer>
          <RoundTitle>Round {gameView.roundNumber}</RoundTitle>

          {NUMBER_CRUNCH_BUCKET_RANGES.map((bucket, i) => {
            return (
              <CellContainer key={i} style={{ paddingRight: "3vh" }}>
                <div style={{ display: "flex" }}>
                  {gameView.currentRound.playerGuesses
                    .filter((guess) => guess.bucketRangeIndex === i)
                    .map((guess, i) => {
                      return (
                        <div key={i} style={{ width: "3vh" }}>
                          <PlayerAvatar
                            playerId={guess.playerId}
                            size="thumbnail"
                          />
                        </div>
                      );
                    })}
                </div>
              </CellContainer>
            );
          })}
        </RoundContainer> */}
        {gameView.currentRound.allPlayersGuessed && (
          <RevealLatestRoundResultsBucket gameView={gameView} />
        )}
      </BucketContainer>
    </div>
  );
};
