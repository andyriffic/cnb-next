import { useCallback, useState } from "react";
import styled from "styled-components";
import tinycolor from "tinycolor2";
import { NUMBER_CRUNCH_BUCKET_RANGES } from "../../services/number-crunch";
import {
  NumberCrunchGameView,
  NumberCrunchPlayerView,
} from "../../services/number-crunch/types";
import THEME from "../../themes";
import { ElevatorPlayers } from "./ElevatorPlayers";
import { NUMBER_CRUNCH_GAME_STATE } from "./hooks/useNumberCrunchGameTiming";

const Container = styled.div`
  position: relative;
`;

const PlayerListContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 10%;
  right: 0;
  bottom: 0;
`;

const PlayerPositionContainer = styled.div<{
  leftIndex: number;
  totalPlayers: number;
  currentGuessContainerIndex: number;
}>`
  position: absolute;
  top: ${({ currentGuessContainerIndex }) =>
    currentGuessContainerIndex * (100 / NUMBER_CRUNCH_BUCKET_RANGES.length) +
    2}%;
  left: ${({ leftIndex, totalPlayers }) => leftIndex * (100 / totalPlayers)}%;
  transition: top 1s ease-in-out;
`;

const BucketContainer = styled.div`
  border-radius: 0.5rem;
  gap: 1rem;
  height: 60vh;
`;

const BucketItem = styled.div`
  height: ${100 / NUMBER_CRUNCH_BUCKET_RANGES.length}%;
`;

const BucketTitle = styled.div`
  font-family: ${THEME.tokens.fonts.feature};
  padding: 1rem;
  font-size: 1.4rem;
`;

const CellContainer = styled.div`
  height: 10vh;
  flex-wrap: wrap;
  /* max-width: 10vh; */
`;

const PlayerName = styled.div`
  font-size: 0.7rem;
  padding: 0.2rem;
`;

export type PlayerVisibleBucketIndexes = Record<string, number>;

function populatePlayerVisibleBucketIndexes(
  players: NumberCrunchPlayerView[],
): PlayerVisibleBucketIndexes {
  const initialIndexes: PlayerVisibleBucketIndexes = {};
  players.forEach((player) => {
    initialIndexes[player.id] = NUMBER_CRUNCH_BUCKET_RANGES.length + 1;
  });
  return initialIndexes;
}

type Props = {
  gameView: NumberCrunchGameView;
  gameState: NUMBER_CRUNCH_GAME_STATE;
  onRoundRevealed: () => void;
};

export const ElevatorResultsBuckets = ({
  gameView,
  gameState,
  onRoundRevealed,
}: Props) => {
  return (
    <Container>
      <BucketContainer>
        {NUMBER_CRUNCH_BUCKET_RANGES.map((bucket, i) => {
          return (
            <BucketItem
              key={i}
              style={{
                backgroundColor: tinycolor(bucket.color)
                  .setAlpha(0.3)
                  .toString(),
              }}
            >
              <BucketTitle
                style={{
                  color: tinycolor(bucket.color).darken(20).toString(),
                }}
              >
                {bucket.title}
              </BucketTitle>
            </BucketItem>
          );
        })}
      </BucketContainer>
      <PlayerListContainer>
        <ElevatorPlayers
          gameView={gameView}
          revealLatestPlayerBuckets={[
            NUMBER_CRUNCH_GAME_STATE.WAITING_TO_REVEAL_ROUND,
            NUMBER_CRUNCH_GAME_STATE.REVEALING_LATEST_ROUND,
            NUMBER_CRUNCH_GAME_STATE.LATEST_ROUND_REVEALED,
            NUMBER_CRUNCH_GAME_STATE.START_NEW_ROUND,
            NUMBER_CRUNCH_GAME_STATE.REVEAL_WINNER,
          ].includes(gameState)}
          onRevealAllPlayersComplete={onRoundRevealed}
        />
      </PlayerListContainer>
    </Container>
  );
};
