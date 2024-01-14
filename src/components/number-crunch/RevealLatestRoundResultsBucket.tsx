import styled from "styled-components";
import { useEffect, useState } from "react";
import {
  NumberCrunchGameView,
  NumberCrunchPlayerGuessView,
} from "../../services/number-crunch/types";
import THEME from "../../themes/types";
import { PlayerAvatar } from "../PlayerAvatar";
import { NUMBER_CRUNCH_BUCKET_RANGES } from "../../services/number-crunch";

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

const sortGuessesFurthestFirst = (
  a: NumberCrunchPlayerGuessView,
  b: NumberCrunchPlayerGuessView
) => b.bucketRangeIndex - a.bucketRangeIndex;

export const RevealLatestRoundResultsBucket = ({ gameView }: Props) => {
  const [playerRevealOrder] = useState(
    gameView.currentRound.playerGuesses.sort(sortGuessesFurthestFirst)
  );
  const [revealIndex, setRevealIndex] = useState(-1);

  useEffect(() => {
    if (revealIndex >= playerRevealOrder.length) {
      return;
    }
    console.log("initialise interval");
    const interval = setInterval(() => {
      console.log("interval", revealIndex);
      setRevealIndex((revealIndex) => revealIndex + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [playerRevealOrder.length, revealIndex]);

  return (
    <RoundContainer>
      <RoundTitle>Round {gameView.roundNumber}</RoundTitle>

      {NUMBER_CRUNCH_BUCKET_RANGES.map((bucket, i) => {
        return (
          <CellContainer key={i} style={{ paddingRight: "3vh" }}>
            <div style={{ display: "flex" }}>
              {playerRevealOrder
                .filter((_, i) => i <= revealIndex)
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
    </RoundContainer>
  );
};
