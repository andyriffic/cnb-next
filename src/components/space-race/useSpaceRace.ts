import { useCallback, useMemo, useState } from "react";
import { Player } from "../../types/Player";
import { selectRandomOneOf } from "../../utils/random";
import { STARMAP_CHART, STARMAP_HEIGHT } from "./constants";
import {
  PlannedCourse,
  SpacePlayersById,
  SpaceRaceCoordinates,
  SpaceRaceGame,
  SpaceRacePlayer,
} from "./types";

export type UseSpaceRace = {
  spaceRaceGame: SpaceRaceGame;
  plotPlayerCourse: (playerId: string, up: number) => void;
  movePlayerVertically: (playerId: string) => void;
  movePlayerHorizontally: (playerId: string) => void;
  randomlyPlotAllPlayerCourses: () => void;
  moveAllPlayersVertically: () => void;
  moveAllPlayersHorizontally: () => void;
};

export const useSpaceRace = (players: Player[]): UseSpaceRace => {
  const [game, setGame] = useState(() => createSpaceRaceGame(players));

  const plotPlayerCourse = useCallback(
    (playerId: string, up: number) => {
      return setGame({
        ...game,
        spacePlayers: assignPlannedCourse(game.spacePlayers, playerId, up),
      });
    },
    [game]
  );

  const movePlayerVertically = useCallback(
    (playerId: string) => {
      return setGame({
        ...game,
        spacePlayers: updatePlayerVerticalPosition(game.spacePlayers, playerId),
      });
    },
    [game]
  );

  const movePlayerHorizontally = useCallback(
    (playerId: string) => {
      return setGame({
        ...game,
        spacePlayers: updatePlayerHorizontalPosition(
          game.spacePlayers,
          playerId
        ),
      });
    },
    [game]
  );

  const randomlyPlotAllPlayerCourses = useCallback(() => {
    let gameCopy: SpaceRaceGame = {
      ...game,
    };

    Object.keys(game.spacePlayers).forEach((playerId) => {
      gameCopy = {
        ...gameCopy,
        spacePlayers: assignPlannedCourse(
          gameCopy.spacePlayers,
          playerId,
          selectRandomOneOf([-2, -1, 0, 1, 2])
        ),
      };
    });
    setGame(gameCopy);
  }, [game]);

  const moveAllPlayersVertically = useCallback(() => {
    let gameCopy: SpaceRaceGame = {
      ...game,
    };

    Object.keys(game.spacePlayers).forEach((playerId) => {
      gameCopy = {
        ...gameCopy,
        spacePlayers: updatePlayerVerticalPosition(
          gameCopy.spacePlayers,
          playerId
        ),
      };
    });
    setGame(gameCopy);
  }, [game]);

  const moveAllPlayersHorizontally = useCallback(() => {
    let gameCopy: SpaceRaceGame = {
      ...game,
    };

    Object.keys(game.spacePlayers).forEach((playerId) => {
      gameCopy = {
        ...gameCopy,
        spacePlayers: updatePlayerHorizontalPosition(
          gameCopy.spacePlayers,
          playerId
        ),
      };
    });
    setGame(gameCopy);
  }, [game]);

  return {
    spaceRaceGame: game,
    plotPlayerCourse,
    movePlayerVertically,
    movePlayerHorizontally,
    randomlyPlotAllPlayerCourses,
    moveAllPlayersVertically,
    moveAllPlayersHorizontally,
  };
};

function createSpaceRaceGame(players: Player[]): SpaceRaceGame {
  const allPlayerIds = players.map((player) => player.id);

  const game: SpaceRaceGame = {
    starmap: STARMAP_CHART,
    spacePlayers: allPlayerIds.reduce<{ [id: string]: SpaceRacePlayer }>(
      (acc, playerId) => {
        const player = players.find((p) => p.id === playerId);

        if (!player) {
          return acc;
        }
        return {
          ...acc,
          [playerId]: {
            id: player.id,
            name: player.name,
            courseMovesRemaining: 5,
            currentPosition: {
              x: 0,
              y: selectRandomOneOf([0, 1, 2, 3, 4, 5, 6, 7, 8]),
            },
            plannedCourse: {
              up: 0,
              down: 0,
              right: 0,
              lockedIn: false,
            },
          },
        };
      },
      {}
    ),
  };

  console.log("Space Race game created", game);

  return game;
}

function assignPlannedCourse(
  spacePlayers: SpacePlayersById,
  playerId: string,
  up: number
): SpacePlayersById {
  const player = spacePlayers[playerId];
  if (!player) return spacePlayers;

  const plannedCourse: PlannedCourse = {
    up,
    right: player.courseMovesRemaining - Math.abs(up),
    lockedIn: true,
  };

  return {
    ...spacePlayers,
    [playerId]: {
      ...player,
      plannedCourse,
      courseMovesRemaining: 0,
    },
  };
}

function updatePlayerVerticalPosition(
  spacePlayers: SpacePlayersById,
  playerId: string
): SpacePlayersById {
  const player = spacePlayers[playerId];
  if (!player) return spacePlayers;
  if (!player.plannedCourse.lockedIn) return spacePlayers;

  const newPosition: SpaceRaceCoordinates = {
    x: player.currentPosition.x,
    y: Math.max(
      Math.min(
        player.currentPosition.y + player.plannedCourse.up,
        STARMAP_HEIGHT - 1
      ),
      0
    ),
  };

  return {
    ...spacePlayers,
    [playerId]: {
      ...player,
      currentPosition: newPosition,
    },
  };
}

function updatePlayerHorizontalPosition(
  spacePlayers: SpacePlayersById,
  playerId: string
): SpacePlayersById {
  const player = spacePlayers[playerId];
  if (!player) return spacePlayers;
  if (!player.plannedCourse.lockedIn) return spacePlayers;

  const newPosition: SpaceRaceCoordinates = {
    x: player.currentPosition.x + Math.abs(player.plannedCourse.right),
    y: player.currentPosition.y,
  };

  return {
    ...spacePlayers,
    [playerId]: {
      ...player,
      currentPosition: newPosition,
    },
  };
}
