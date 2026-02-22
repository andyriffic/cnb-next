import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  MysteryBoxGameRoundView,
  MysteryBoxGameView,
  MysteryBoxPlayerView,
} from "../../services/mystery-box/types";
import { Coordinates } from "../pacman/types";
import { Attention } from "../animations/Attention";
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
  transition:
    top linear 500ms,
    right linear 500ms;
`;
const PositionedPlayerPixels = styled.div<{ coordinates: Coordinates }>`
  position: absolute;
  top: ${({ coordinates }) => `${coordinates.y}px`};
  left: ${({ coordinates }) => `${coordinates.x}px`};
  transition:
    top linear 500ms,
    left linear 500ms;
`;

const PositionedPlayerPercentage = styled.div<{ coordinates: Coordinates }>`
  position: absolute;
  top: ${({ coordinates }) => `${coordinates.y}vh`};
  left: ${({ coordinates }) => `${coordinates.x}vw`};
  transition:
    top linear 500ms,
    left linear 500ms;
`;

type Position = { topPercent: number; rightPercent: number };
const DEFAULT_POSITION: Position = { topPercent: 30, rightPercent: 50 };

type PlayerWithCoordinates = {
  playerId: string;
  coordinates: Coordinates;
};

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
  currentRound: MysteryBoxGameRoundView,
  offset: Coordinates,
): Position {
  if (playerPosition === "waiting") {
    return {
      topPercent: DEFAULT_POSITION.topPercent + offset.y,
      rightPercent: DEFAULT_POSITION.rightPercent + offset.x,
    };
  }

  if (player.currentlySelectedBoxId !== undefined) {
    const boxPosition = currentRound.boxes.findIndex(
      (b) => b.id === player.currentlySelectedBoxId,
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
  offset: Coordinates,
): Coordinates {
  if (playerPosition === "waiting") {
    return {
      x: center.x + offset.x,
      y: center.y + offset.y,
    };
  }

  return { x: 0, y: 0 };
}

function getInitialPositionMap(
  activePlayers: MysteryBoxPlayerView[],
  windowWidth: number,
): PlayerWithCoordinates[] {
  // const positionMap = createCircularPositionMap(
  //   300,
  //   300,
  //   activePlayers.length,
  //   {
  //     x: windowWidth / 2 - 200,
  //     y: 160,
  //   },
  // );

  const playerCloseness = 4;

  const leftOffset = 50 - (activePlayers.length / 2) * playerCloseness;

  const positionMap = createLinearPositionMap(
    activePlayers.length,
    playerCloseness,
    {
      x: leftOffset,
      y: 40,
    },
  );

  const pp = activePlayers.map<PlayerWithCoordinates>((p, i) => ({
    playerId: p.id,
    coordinates: positionMap[i] || { x: 0, y: 0 },
  }));
  return pp;
}

function createLinearPositionMap(
  totalItemCount: number,
  itemOffset: number,
  offset: Coordinates = { x: 0, y: 0 },
): Coordinates[] {
  const coordinates: Coordinates[] = [];

  for (let i = 0; i < totalItemCount; i++) {
    coordinates.push({
      x: offset.x + i * itemOffset,
      y: offset.y,
    });
  }
  return coordinates;
}

function getPlayerBoxSelectionCoordinates(
  activePlayers: MysteryBoxPlayerView[],
  boxId: number,
  offest: Coordinates,
): PlayerWithCoordinates[] {
  const playersChosenBox = activePlayers.filter(
    (p) => p.currentlySelectedBoxId === boxId,
  );

  // const box1PositionMap = createCircularPositionMap(
  //   300,
  //   300,
  //   playersChosenBox.length,
  //   offest
  // );
  const box1PositionMap = createLinearPositionMap(
    playersChosenBox.length,
    2,
    offest,
  );

  const pp = playersChosenBox.map<PlayerWithCoordinates>((p, i) => ({
    playerId: p.id,
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
  const activePlayers = game.players.filter((p) => p.status !== "eliminated");
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const playerPositionsRef = useRef<PlayerWithCoordinates[]>(
    getInitialPositionMap(activePlayers, windowDimensions.width),
  );

  const activePlayerPositions = useMemo(() => {
    const initialPositionMap =
      playerPositionsRef.current.length !== activePlayers.length
        ? getInitialPositionMap(activePlayers, windowDimensions.width)
        : playerPositionsRef.current;

    if (
      gameState.gameState ===
      MysteryBoxGameState.WAITING_FOR_PLAYERS_TO_SELECT_BOX
    ) {
      playerPositionsRef.current = getInitialPositionMap(
        activePlayers,
        windowDimensions.width,
      );
      return playerPositionsRef.current;
    } else if (
      gameState.gameState >= MysteryBoxGameState.SHOW_PLAYER_BOX_SELECTIONS
    ) {
      const quarterWidth = windowDimensions.width / 4;
      const updatedPlayerPositionsArray = [
        ...getPlayerBoxSelectionCoordinates(activePlayers, 0, {
          x: 5,
          y: 32,
        }),
        ...getPlayerBoxSelectionCoordinates(activePlayers, 1, {
          x: 30,
          y: 32,
        }),
        ...getPlayerBoxSelectionCoordinates(activePlayers, 2, {
          x: 55,
          y: 32,
        }),
        ...getPlayerBoxSelectionCoordinates(activePlayers, 3, {
          x: 80,
          y: 32,
        }),
      ];

      const updatedPlayerPositions = playerPositionsRef.current.map((pp) => {
        const newPosition = updatedPlayerPositionsArray.find(
          (p) => p.playerId === pp.playerId,
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
  }, [activePlayers, gameState.gameState, windowDimensions.width]);

  // const positionMap = createCircularPositionMap(400, 400, activePlayers.length);
  return (
    <>
      {activePlayers.map((player) => {
        const coordinates = activePlayerPositions.find(
          (p) => p.playerId === player.id,
        )?.coordinates;

        if (!coordinates) {
          return null;
        }

        const currentBox = game.currentRound.boxes.find(
          (b) => b.id === player.currentlySelectedBoxId,
        );
        // const offset = positionMap[index] || { x: 0, y: 0 };
        return (
          <PositionedPlayerPercentage key={player.id} coordinates={coordinates}>
            <Attention
              animate={
                !!game.individualMode &&
                game.individualMode.playerId === player.id
              }
              animation="vibrate"
            >
              <MysteryBoxPlayerUi
                player={player}
                status={
                  game.gameOverSummary &&
                  game.gameOverSummary.outrightWinnerPlayerId === player.id
                    ? "winner"
                    : "active"
                }
                avatarSize={
                  activePlayerPositions.length <= 4 ? "thumbnail" : "tiny"
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
            </Attention>
          </PositionedPlayerPercentage>
        );
      })}
    </>
  );
};
