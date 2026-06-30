import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { NUMBER_CRUNCH_BUCKET_RANGES } from "../../services/number-crunch";
import {
  NumberCrunchGameView,
  NumberCrunchPlayerGuessView,
} from "../../services/number-crunch/types";
import { Pill } from "../Atoms";
import { PlayerAvatar } from "../PlayerAvatar";
import { Attention } from "../animations/Attention";
import { useSound } from "../hooks/useSound";
import { PlayerVisibleBucketIndexes } from "./ElevatorResultsBuckets";

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
  transition:
    top 1s ease-in-out 500ms,
    transform 0.3s ease-in-out;
`;

const PlayerName = styled.div`
  border: 2px solid #ccc;
  color: darkred;
  background-color: #fff;
  padding: 5px;
  border-radius: 5px;
  text-transform: uppercase;
  font-size: 0.7rem;
  white-space: nowrap;
`;

const sortGuessesFurthestFirst = (
  a: NumberCrunchPlayerGuessView,
  b: NumberCrunchPlayerGuessView,
) => b.bucketRangeIndex - a.bucketRangeIndex;

const getGuessProgress = (
  latestGuess: NumberCrunchPlayerGuessView | undefined,
  previousGuess: NumberCrunchPlayerGuessView | undefined,
): "🟢" | "🔴" | "🟠" => {
  if (!previousGuess) return "🟠";
  if (!latestGuess) return "🟠";
  if (latestGuess.bucketRangeIndex < previousGuess.bucketRangeIndex)
    return "🟢";
  if (latestGuess.bucketRangeIndex > previousGuess.bucketRangeIndex)
    return "🔴";
  return "🟠";
};

type Props = {
  gameView: NumberCrunchGameView;
  revealLatestPlayerBuckets: boolean;
  onRevealAllPlayersComplete: () => void;
};

export const ElevatorPlayers = ({
  gameView,
  revealLatestPlayerBuckets,
  onRevealAllPlayersComplete,
}: Props) => {
  const { play } = useSound();

  const [playerRevealOrder, setPlayerRevealOrder] = useState<
    NumberCrunchPlayerGuessView[]
  >([]);
  const [revealIndex, setRevealIndex] = useState(-1);
  const playerIdsRevealed = useRef<string[]>([]);

  useEffect(() => {
    if (!revealLatestPlayerBuckets) {
      setPlayerRevealOrder([]);
      setRevealIndex(-1);
      playerIdsRevealed.current = [];
      return;
    }

    setPlayerRevealOrder(
      gameView.currentRound.playerGuesses.sort(sortGuessesFurthestFirst),
    );

    console.log("initialise interval");
    const interval = setInterval(() => {
      const revealIndexToUse = revealIndex + 1;
      console.log("interval", revealIndexToUse);
      const revealedPlayerId = playerRevealOrder[revealIndexToUse]?.playerId;
      if (revealedPlayerId) {
        play("number-crunch-reveal-guess");
        playerIdsRevealed.current = [
          ...playerIdsRevealed.current,
          revealedPlayerId,
        ];
        if (playerIdsRevealed.current.length === gameView.players.length) {
          onRevealAllPlayersComplete();
        }
      }
      setRevealIndex(revealIndexToUse);
    }, 2000);
    return () => clearInterval(interval);
  }, [
    play,
    revealLatestPlayerBuckets,
    playerRevealOrder,
    revealIndex,
    gameView.currentRound.playerGuesses,
    gameView.players.length,
    onRevealAllPlayersComplete,
  ]);

  return (
    <>
      {gameView.players.map((p, i) => {
        const latestGuess = gameView.currentRound.playerGuesses.find(
          (g) => g.playerId === p.id,
        );
        const previousGuess = gameView.previousRounds[
          gameView.previousRounds.length - 1
        ]?.playerGuesses.find((g) => g.playerId === p.id);

        const thisPlayerRevealOrder = playerRevealOrder.findIndex(
          (g) => g.playerId === p.id,
        );
        const revealing =
          revealIndex > -1 && revealIndex === thisPlayerRevealOrder;
        const revealed = revealIndex > thisPlayerRevealOrder;

        const direction = getGuessProgress(latestGuess, previousGuess);

        const currentGuessContainer =
          revealing || revealed
            ? latestGuess?.bucketRangeIndex
            : previousGuess?.bucketRangeIndex;
        return (
          <PlayerPositionContainer
            key={p.id}
            leftIndex={i}
            totalPlayers={gameView.players.length}
            currentGuessContainerIndex={
              currentGuessContainer !== undefined
                ? currentGuessContainer
                : NUMBER_CRUNCH_BUCKET_RANGES.length
            }
            style={{
              color: p.guessedThisRound ? "lightgreen" : "darkred",
              textAlign: "center",
              opacity: p.guessedThisRound ? 1 : 0.7,
              transform: revealing ? "scale(1.5)" : "scale(1)",
            }}
          >
            <Attention animate={!p.guessedThisRound} animation="shake">
              <PlayerAvatar
                playerId={p.id}
                size="tiny"
                hasAdvantage={p.advantage}
              />
            </Attention>
            <PlayerName>{p.name}</PlayerName>
          </PlayerPositionContainer>
        );
      })}
    </>
  );
};
