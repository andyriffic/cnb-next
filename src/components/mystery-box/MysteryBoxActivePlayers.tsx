import styled from "styled-components";
import {
  MysteryBoxGameRoundView,
  MysteryBoxGameView,
  MysteryBoxPlayerView,
} from "../../services/mystery-box/types";
import { MysteryBoxPlayerUi } from "./MysteryBoxPlayer";
import {
  MysteryBoxGameState,
  MysteryBoxUIState,
} from "./useMysteryBoxGameState";

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

// function createDefaultPositionMap() {
//   const container = document.querySelector(".circle-container");
//   const items = document.querySelectorAll(".item");
//   const containerWidth = container.offsetWidth;
//   const containerHeight = container.offsetHeight;
//   const radius = Math.min(containerWidth, containerHeight) / 2;
//   const numItems = items.length;

//   for (let i = 0; i < numItems; i++) {
//     const angle = (i / numItems) * 2 * Math.PI; // Calculate the angle in radians
//     const x = containerWidth / 2 + radius * Math.cos(angle); // Calculate X coordinate
//     const y = containerHeight / 2 + radius * Math.sin(angle); // Calculate Y coordinate

//     items[i].style.left = x + "px";
//     items[i].style.top = y + "px";
//   }
// }

type Props = {
  game: MysteryBoxGameView;
  gameState: MysteryBoxUIState;
  playerPosition: PlayerPositions;
};

export const MysteryBoxActivePlayers = ({
  game,
  gameState,
  playerPosition,
}: Props) => {
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
              <MysteryBoxPlayerUi player={player} exploded={false} />
            </PositionedPlayer>
          );
        })}
    </>
  );
};
