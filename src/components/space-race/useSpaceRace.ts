import { useCallback, useEffect, useMemo, useState } from "react";
import { getPlayerSpaceRaceDetails, Player } from "../../types/Player";
import { selectRandomOneOf } from "../../utils/random";
import { clamp } from "../../utils/number";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { useSound } from "../hooks/useSound";
import { QueryUserOption } from "../../services/query-user/types";
import { STARMAP_CHART, STARMAP_HEIGHT } from "./constants";
import {
  PlannedCourse,
  SpacePlayersById,
  SpaceRaceCoordinates,
  SpaceRaceEntity,
  SpaceRaceGame,
  SpaceRacePlayer,
} from "./types";

const SPACE_COURSE_QUESTION_ID = "SPACERACE_COURSE";

export type UseSpaceRace = {
  spaceRaceGame: SpaceRaceGame;
  plotPlayerCourse: (playerId: string, up: number) => void;
  movePlayerVertically: (playerId: string) => void;
  movePlayerHorizontally: (playerId: string) => void;
  randomlyPlotAllPlayerCourses: () => void;
  moveAllPlayersVertically: () => void;
  moveAllPlayersHorizontally: () => void;
  sendCourseQuestionToPlayers: () => void;
};

export const useSpaceRace = (players: Player[]): UseSpaceRace => {
  const [game, setGame] = useState(() => createSpaceRaceGame(players));
  const { playerQuery } = useSocketIo();
  const { play } = useSound();

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
      play("space-race-rocket-move");
      movePlayerVertically(playerToMove.id);
    }
  }, [game.spacePlayers, movePlayerVertically, play]);

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

  useEffect(() => {
    Object.keys(playerQuery.questionsByPlayerId).forEach((playerId) => {
      const question = playerQuery.questionsByPlayerId[playerId];
      if (!question || question.id !== SPACE_COURSE_QUESTION_ID) return;
      if (question.selectedOptionIndex === undefined) return;

      const answer = question.options[question.selectedOptionIndex]!;
      const playerCourseAlreadyLockedIn =
        game.spacePlayers[playerId]?.plannedCourse.lockedIn;

      if (playerCourseAlreadyLockedIn) return;

      console.log("Answering course question", playerId, answer);

      plotPlayerCourse(playerId, parseInt(answer.value.toString()));
      playerQuery.deletePlayerQuestion(playerId);
    });
  }, [
    game.spacePlayers,
    playerQuery,
    playerQuery.questionsByPlayerId,
    plotPlayerCourse,
  ]);

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

  const sendCourseQuestionToPlayers = useCallback(() => {
    const MAX_COURSE_Y_OFFSET = 2;

    Object.values(game.spacePlayers).forEach((spacePlayer) => {
      const maxUpAdjustedForTopOfScreen =
        spacePlayer.currentPosition.y - MAX_COURSE_Y_OFFSET < 0
          ? MAX_COURSE_Y_OFFSET -
            Math.abs(spacePlayer.currentPosition.y - MAX_COURSE_Y_OFFSET)
          : MAX_COURSE_Y_OFFSET;

      const maxDownAdjustedForBottomOfScreen =
        spacePlayer.currentPosition.y + MAX_COURSE_Y_OFFSET > STARMAP_HEIGHT - 1
          ? spacePlayer.currentPosition.y +
            MAX_COURSE_Y_OFFSET -
            STARMAP_HEIGHT -
            1
          : MAX_COURSE_Y_OFFSET;

      const upObstacle = getVerticalEntityBetween(
        spacePlayer.currentPosition,
        -maxUpAdjustedForTopOfScreen
      );
      const downObstacle = getVerticalEntityBetween(
        spacePlayer.currentPosition,
        maxDownAdjustedForBottomOfScreen
      );

      const maxUp = upObstacle
        ? upObstacle.position.y - spacePlayer.currentPosition.y + 1
        : -maxUpAdjustedForTopOfScreen;

      const maxDown = downObstacle
        ? downObstacle.position.y - spacePlayer.currentPosition.y - 1
        : maxDownAdjustedForBottomOfScreen;

      const allCourseOptions: QueryUserOption<number>[] = [
        { text: "⬆️⬆️", value: -2 },
        { text: "⬆️", value: -1 },
        { text: "➡️", value: 0 },
        { text: "⬇️", value: 1 },
        { text: "⬇️⬇️", value: 2 },
      ].filter((option) => option.value >= maxUp && option.value <= maxDown);

      console.log("Player course", spacePlayer.id, upObstacle, downObstacle);

      playerQuery.createPlayerQuestion(spacePlayer.id, {
        id: SPACE_COURSE_QUESTION_ID,
        question: "Plot your course 規劃你的路線",
        style: "emoji-stack",
        options: allCourseOptions,
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
    sendCourseQuestionToPlayers,
  };
};

function createSpaceRaceGame(players: Player[]): SpaceRaceGame {
  const allPlayerIds = players.map((player) => player.id);

  let nextAssignedYCoordinate = 0;

  const game: SpaceRaceGame = {
    starmap: STARMAP_CHART,
    spacePlayers: allPlayerIds.reduce<{ [id: string]: SpaceRacePlayer }>(
      (acc, playerId) => {
        const player = players.find((p) => p.id === playerId);

        if (!player) {
          return acc;
        }

        const isNewPlayer = !player.details?.spaceRace;
        const spaceRaceDetails = getPlayerSpaceRaceDetails(player);

        const startingYCoordinate = isNewPlayer
          ? nextAssignedYCoordinate
          : spaceRaceDetails.yCoordinate;
        const startingXCoordinate = isNewPlayer
          ? 0
          : spaceRaceDetails.xCoordinate;

        if (isNewPlayer) {
          nextAssignedYCoordinate += 1;
          if (nextAssignedYCoordinate >= STARMAP_HEIGHT) {
            nextAssignedYCoordinate = 0;
          }
        }

        return {
          ...acc,
          [playerId]: {
            id: player.id,
            name: player.name,
            color: player.details?.colourHex || "#770000",
            courseMovesRemaining: player.details?.gameMoves || 0,
            currentPosition: {
              x: startingXCoordinate,
              y: startingYCoordinate,
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
): SpaceRaceEntity | undefined {
  for (let i = currentPosition.x; i <= horizontalDistance; i++) {
    const entity = STARMAP_CHART.entities.find(
      (entity) =>
        entity.position.x === i && entity.position.y === currentPosition.y
    );
    if (entity) {
      return entity;
    }
  }
}

function getVerticalEntityBetween(
  currentPosition: SpaceRaceCoordinates,
  verticalDistance: number
): SpaceRaceEntity | undefined {
  if (verticalDistance === 0) return;

  const direction = verticalDistance < 0 ? "up" : "down";

  if (direction === "up") {
    for (let i = currentPosition.y; i >= verticalDistance; i--) {
      const entity = STARMAP_CHART.entities.find(
        (entity) =>
          entity.position.x === currentPosition.x && entity.position.y === i
      );
      if (entity) {
        return entity;
      }
    }
  }

  if (direction === "down") {
    for (let i = currentPosition.y; i <= verticalDistance; i++) {
      const entity = STARMAP_CHART.entities.find(
        (entity) =>
          entity.position.x === currentPosition.x && entity.position.y === i
      );
      if (entity) {
        return entity;
      }
    }
  }
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
      collidedWith: hitEntity,
    },
  };
}
