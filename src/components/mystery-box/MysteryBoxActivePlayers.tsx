import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  MysteryBoxGameRoundView,
  MysteryBoxGameView,
  MysteryBoxPlayerView,
} from "../../services/mystery-box/types";
import { Coordinates } from "../pacman/types";
import { createCircularPositionMap } from "./DisplayItemsInCircle";
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
const PositionedPlayerPixels = styled.div<{ coordinates: Coordinates }>`
  position: absolute;
  top: ${({ coordinates }) => `${coordinates.y}px`};
  left: ${({ coordinates }) => `${coordinates.x}px`};
  transition: top linear 500ms, left linear 500ms;
`;

type Position = { topPercent: number; rightPercent: number };
const DEFAULT_POSITION: Position = { topPercent: 30, rightPercent: 50 };

type PlayerWithCoordinates = {
  player: MysteryBoxPlayerView;
  coordinates: Coordinates;
};

const BOX_POSITIONS: Record<number, Position> = {
  0: { topPercent: 10, rightPercent: 90 },
  1: { topPercent: 10, rightPercent: 10 },
  2: { topPercent: 80, rightPercent: 90 },
  3: { topPercent: 80, rightPercent: 10 },
};

const BOX_POSITIONS_2: Record<number, Coordinates & { size: number }> = {
  0: { x: 10, y: 90, size: 200 },
  1: { x: 10, y: 90, size: 200 },
  2: { x: 10, y: 90, size: 200 },
  3: { x: 10, y: 90, size: 200 },
};

export type PlayerPositions = "waiting" | "next-to-chosen-box";

function getPlayerPosition(
  player: MysteryBoxPlayerView,
  playerPosition: PlayerPositions,
  currentRound: MysteryBoxGameRoundView,
  offset: Coordinates
): Position {
  if (playerPosition === "waiting") {
    return {
      topPercent: DEFAULT_POSITION.topPercent + offset.y,
      rightPercent: DEFAULT_POSITION.rightPercent + offset.x,
    };
  }

  if (player.currentlySelectedBoxId !== undefined) {
    const boxPosition = currentRound.boxes.findIndex(
      (b) => b.id === player.currentlySelectedBoxId
    );
    return BOX_POSITIONS[boxPosition] || DEFAULT_POSITION;
  }

  return DEFAULT_POSITION;
}

function getPlayerCoordinates(
  player: MysteryBoxPlayerView,
  playerPosition: PlayerPositions,
  currentRound: MysteryBoxGameRoundView,
  center: Coordinates,
  offset: Coordinates
): Coordinates {
  if (playerPosition === "waiting") {
    return {
      x: center.x + offset.x,
      y: center.y + offset.y,
    };
  }

  return { x: 0, y: 0 };
}

function getPlayerBoxSelectionCoordinates(
  activePlayers: MysteryBoxPlayerView[],
  boxId: number,
  offest: Coordinates
): PlayerWithCoordinates[] {
  const playersChosenBox = activePlayers.filter(
    (p) => p.currentlySelectedBoxId === boxId
  );

  const box1PositionMap = createCircularPositionMap(
    300,
    300,
    playersChosenBox.length,
    offest
  );

  const pp = playersChosenBox.map<PlayerWithCoordinates>((p, i) => ({
    player: p,
    coordinates: box1PositionMap[i] || { x: 0, y: 0 },
  }));
  return pp;
}

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
  const playerPositionsRef = useRef<PlayerWithCoordinates[]>([]);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const activePlayerPositions = useMemo(() => {
    const activePlayers = game.players.filter((p) => p.status !== "eliminated");

    if (
      gameState.gameState ===
        MysteryBoxGameState.WAITING_FOR_PLAYERS_TO_SELECT_BOX &&
      playerPositionsRef.current.length !== activePlayers.length
    ) {
      // Initialize player positions in a circle
      const activePlayers = game.players.filter(
        (p) => p.status !== "eliminated"
      );
      const positionMap = createCircularPositionMap(
        400,
        400,
        game.players.filter((p) => p.status !== "eliminated").length,
        {
          x: windowDimensions.width / 2 - 200,
          y: 200,
        }
      );

      const pp = activePlayers.map<PlayerWithCoordinates>((p, i) => ({
        player: p,
        coordinates: positionMap[i] || { x: 0, y: 0 },
      }));
      playerPositionsRef.current = pp;
      return pp;
    } else if (
      gameState.gameState === MysteryBoxGameState.SHOW_PLAYER_BOX_SELECTIONS &&
      activePlayers.length === playerPositionsRef.current.length
    ) {
      const updatedPlayerPositionsArray = [
        ...getPlayerBoxSelectionCoordinates(activePlayers, 0, {
          x: 100,
          y: 50,
        }),
        ...getPlayerBoxSelectionCoordinates(activePlayers, 1, {
          x: windowDimensions.width - 500,
          y: 50,
        }),
        ...getPlayerBoxSelectionCoordinates(activePlayers, 2, {
          x: 100,
          y: 500,
        }),
        ...getPlayerBoxSelectionCoordinates(activePlayers, 3, {
          x: windowDimensions.width - 500,
          y: 500,
        }),
      ];

      const updatedPlayerPositions = playerPositionsRef.current.map((pp) => {
        const newPosition = updatedPlayerPositionsArray.find(
          (p) => p.player.id === pp.player.id
        );
        if (newPosition) {
          return newPosition;
        }
        return pp;
      });

      playerPositionsRef.current = updatedPlayerPositions;
      return playerPositionsRef.current;
    } else {
      return playerPositionsRef.current;
    }
  }, [gameState.gameState, game]);

  // const positionMap = createCircularPositionMap(400, 400, activePlayers.length);
  return (
    <>
      {activePlayerPositions.map((playerWithCoordinates, index) => {
        const currentBox = game.currentRound.boxes.find(
          (b) => b.id === playerWithCoordinates.player.currentlySelectedBoxId
        );
        // const offset = positionMap[index] || { x: 0, y: 0 };
        return (
          <PositionedPlayerPixels
            key={playerWithCoordinates.player.id}
            coordinates={playerWithCoordinates.coordinates}
          >
            <MysteryBoxPlayerUi
              player={playerWithCoordinates.player}
              status={
                game.gameOverSummary &&
                game.gameOverSummary.outrightWinnerPlayerId ===
                  playerWithCoordinates.player.id
                  ? "winner"
                  : "active"
              }
              avatarSize={
                activePlayerPositions.length === 2 ? "thumbnail" : "tiny"
              }
              explode={
                gameState.gameState >=
                  MysteryBoxGameState.SHOW_BOX_REVEAL_RESULT &&
                !!currentBox &&
                currentBox.contents.type === "bomb"
              }
              showSelectedStatus={
                gameState.gameState ===
                MysteryBoxGameState.WAITING_FOR_PLAYERS_TO_SELECT_BOX
              }
            />
          </PositionedPlayerPixels>
        );
      })}
    </>
  );
};
