import { useCallback, useEffect, useMemo, useState } from "react";
import { Player } from "../../types/Player";
import { selectRandomOneOf } from "../../utils/random";
import { clamp } from "../../utils/number";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { STARMAP_CHART, STARMAP_HEIGHT } from "./constants";
import {
  PlannedCourse,
  SpacePlayersById,
  SpaceRaceCoordinates,
  SpaceRaceEntity,
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
  const { playerQuery } = useSocketIo();

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

  useEffect(() => {
    const playersToMoveVertically = Object.values(game.spacePlayers).filter(
      (p) => p.plannedCourse.lockedIn && !p.plannedCourse.movedVertically
    );

    if (playersToMoveVertically.length > 0) {
      const playerToMove = playersToMoveVertically[0]!;
      movePlayerVertically(playerToMove.id);
    }
  }, [game.spacePlayers, movePlayerVertically]);

  useEffect(() => {
    const playersToMoveHorizontally = Object.values(game.spacePlayers).filter(
      (p) =>
        p.plannedCourse.lockedIn &&
        p.plannedCourse.movedVertically &&
        !p.plannedCourse.movedHorizontally
    );

    if (playersToMoveHorizontally.length > 0) {
      const playerToMove = playersToMoveHorizontally[0]!;
      const timeout = setTimeout(() => {
        movePlayerHorizontally(playerToMove.id);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [game.spacePlayers, movePlayerHorizontally]);

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

  const sendCourseQuestionToUsers = useCallback(() => {
    Object.values(game.spacePlayers).forEach((spacePlayer) => {
      playerQuery.createPlayerQuestion(spacePlayer.id, {
        id: "SPACERACE_COURSE",
        question: "Where do you want to go?",
        style: "emoji",
        options: [
          { text: "👆1", value: "up_1" },
          { text: "👆1", value: "up_1" },
          { text: "", value: "up_1" },
          { text: "👆1", value: "up_1" },
          { text: "👆1", value: "up_1" },
        ],
      });
    });
  }, [game.spacePlayers, playerQuery]);

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
            courseMovesRemaining: 7,
            currentPosition: {
              x: 0,
              y: 1, //selectRandomOneOf([0, 1, 2, 3, 4, 5, 6, 7, 8]),
            },
            plannedCourse: {
              up: 0,
              right: 0,
              lockedIn: false,
              movedVertically: false,
              movedHorizontally: false,
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
  if (player.courseMovesRemaining < 1) return spacePlayers;

  const plannedCourse: PlannedCourse = {
    up,
    right: Math.max(player.courseMovesRemaining - Math.abs(up), 0),
    lockedIn: true,
    movedVertically: false,
    movedHorizontally: false,
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
    y: clamp(
      player.currentPosition.y + player.plannedCourse.up,
      0,
      STARMAP_HEIGHT - 1
    ),
  };

  const newPlannedCourse = {
    ...player.plannedCourse,
    up: 0,
    lockedIn: true,
    movedVertically: true,
  };

  return {
    ...spacePlayers,
    [playerId]: {
      ...player,
      currentPosition: newPosition,
      plannedCourse: newPlannedCourse,
    },
  };
}

function setPlayerCoordinates(
  player: SpaceRacePlayer,
  coordinates: SpaceRaceCoordinates
): SpaceRacePlayer {
  return {
    ...player,
    currentPosition: coordinates,
  };
}

function getHorizontalEntityBetween(
  currentPosition: SpaceRaceCoordinates,
  horizontalDistance: number
): SpaceRaceEntity | null {
  for (let i = currentPosition.x; i <= horizontalDistance; i++) {
    const entity = STARMAP_CHART.entities.find(
      (entity) =>
        entity.position.x === i && entity.position.y === currentPosition.y
    );
    if (entity) {
      return entity;
    }
  }

  return null;
}

function updatePlayerHorizontalPosition(
  spacePlayers: SpacePlayersById,
  playerId: string
): SpacePlayersById {
  const player = spacePlayers[playerId];
  if (!player) return spacePlayers;
  if (!player.plannedCourse.lockedIn) return spacePlayers;

  const hitEntity = getHorizontalEntityBetween(
    player.currentPosition,
    player.plannedCourse.right
  );

  const newPosition: SpaceRaceCoordinates = hitEntity
    ? { x: hitEntity.position.x - 1, y: player.currentPosition.y }
    : {
        x: player.currentPosition.x + Math.abs(player.plannedCourse.right),
        y: player.currentPosition.y,
      };

  const newPlannedCourse = {
    ...player.plannedCourse,
    right: 0,
    lockedIn: true,
    movedHorizontally: true,
  };

  return {
    ...spacePlayers,
    [playerId]: {
      ...setPlayerCoordinates(player, newPosition),
      plannedCourse: newPlannedCourse,
    },
  };
}
