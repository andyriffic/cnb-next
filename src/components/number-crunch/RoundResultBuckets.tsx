import styled from "styled-components";
import { useCallback } from "react";
import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { Pill, SmallHeading } from "../Atoms";
import { PlayerAvatar } from "../PlayerAvatar";
import THEME from "../../themes";
import { NUMBER_CRUNCH_BUCKET_RANGES } from "../../services/number-crunch";
import { usePlayerNames } from "../../providers/PlayerNamesProvider";
import { RevealLatestRoundResultsBucket } from "./RevealLatestRoundResultsBucket";
import { NUMBER_CRUNCH_GAME_STATE } from "./hooks/useNumberCrunchGameTiming";

const BucketContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const RoundContainer = styled.div`
  border-radius: 1rem;
  background: ${THEME.tokens.colours.secondaryBackground};
  padding: 1rem;
`;

const RoundTitle = styled.div``;

const CellContainer = styled.div`
  height: 10vh;
  flex-wrap: wrap;
  /* max-width: 10vh; */
`;

const PlayerName = styled.div`
  font-size: 0.7rem;
  padding: 0.2rem;
`;

type Props = {
  gameView: NumberCrunchGameView;
  gameState: NUMBER_CRUNCH_GAME_STATE;
  onRoundRevealed: () => void;
};

export const RoundResultBuckets = ({
  gameView,
  gameState,
  onRoundRevealed,
}: Props) => {
  const onRevealPlayer = useCallback(
    (revealedPlayerIds: string[]) => {
      if (revealedPlayerIds.length === gameView.players.length) {
        onRoundRevealed();
      }
    },
    [gameView.players.length, onRoundRevealed]
  );
  const { getName } = usePlayerNames();

  return (
    <div>
      <BucketContainer>
        <RoundContainer style={{ width: "14vw" }}>
          <RoundTitle>&nbsp;</RoundTitle>
          {NUMBER_CRUNCH_BUCKET_RANGES.map((bucket, i) => {
            return (
              <CellContainer key={i}>
                <SmallHeading
                  style={{ color: NUMBER_CRUNCH_BUCKET_RANGES[i]!.color }}
                >
                  {bucket.title}
                </SmallHeading>
              </CellContainer>
            );
          })}
        </RoundContainer>
        {gameView.previousRounds.slice(-3).map((round, i) => {
          return (
            <RoundContainer key={i} style={{ width: "14vw" }}>
              <RoundTitle>Round {round.roundNumber}</RoundTitle>

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
                            <PlayerName key={i}>
                              {getName(guess.playerId)}
                            </PlayerName>
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
        {[
          NUMBER_CRUNCH_GAME_STATE.WAITING_TO_REVEAL_ROUND,
          NUMBER_CRUNCH_GAME_STATE.REVEALING_LATEST_ROUND,
          NUMBER_CRUNCH_GAME_STATE.LATEST_ROUND_REVEALED,
          NUMBER_CRUNCH_GAME_STATE.START_NEW_ROUND,
          NUMBER_CRUNCH_GAME_STATE.REVEAL_WINNER,
        ].includes(gameState) && (
          <RevealLatestRoundResultsBucket
            gameView={gameView}
            onReveal={onRevealPlayer}
          />
        )}
      </BucketContainer>
    </div>
  );
};
