import styled from "styled-components";
import {
  MysteryBoxGameRoundView,
  MysteryBoxGameView,
  MysteryBoxPlayerView,
} from "../../services/mystery-box/types";
import { MysteryBoxPlayerUi } from "./MysteryBoxPlayer";

const PositionedPlayer = styled.div<{ position: Position }>`
  position: absolute;
  top: ${({ position }) => `${position.topPercent}%`};
  right: ${({ position }) => `${position.rightPercent}%`};
  transition: top linear 500ms, right linear 500ms;
`;

type Position = { topPercent: number; rightPercent: number };
const DEFAULT_POSITION: Position = { topPercent: 30, rightPercent: 50 };

const BOX_POSITIONS: Record<number, Position> = {
  0: { topPercent: 10, rightPercent: 90 },
  1: { topPercent: 10, rightPercent: 10 },
  2: { topPercent: 80, rightPercent: 90 },
  3: { topPercent: 80, rightPercent: 10 },
};

export type PlayerPositions = "waiting" | "next-to-chosen-box";

function getPlayerPosition(
  player: MysteryBoxPlayerView,
  playerPosition: PlayerPositions,
  currentRound: MysteryBoxGameRoundView
): Position {
  if (playerPosition === "waiting") {
    return DEFAULT_POSITION;
  }

  if (player.currentlySelectedBoxId !== undefined) {
    const boxPosition = currentRound.boxes.findIndex(
      (b) => b.id === player.currentlySelectedBoxId
    );
    return BOX_POSITIONS[boxPosition] || DEFAULT_POSITION;
  }

  return DEFAULT_POSITION;
}

type Props = {
  game: MysteryBoxGameView;
  playerPosition: PlayerPositions;
};

export const MysteryBoxActivePlayers = ({ game, playerPosition }: Props) => {
  return (
    <>
      {game.players
        .filter((p) => p.status !== "eliminated")
        .map((player) => {
          return (
            <PositionedPlayer
              key={player.id}
              position={getPlayerPosition(
                player,
                playerPosition,
                game.currentRound
              )}
            >
              <MysteryBoxPlayerUi player={player} />
            </PositionedPlayer>
          );
        })}
    </>
  );
};
