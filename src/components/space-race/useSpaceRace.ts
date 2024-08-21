import { useCallback, useEffect, useMemo, useState } from "react";
import { getPlayerSpaceRaceDetails, Player } from "../../types/Player";
import { selectRandomOneOf } from "../../utils/random";
import { clamp } from "../../utils/number";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { useSound } from "../hooks/useSound";
import { QueryUserOption } from "../../services/query-user/types";
import { updatePlayerDetails } from "../../utils/api";
import { createEntity, STARMAP_CHART, STARMAP_HEIGHT } from "./constants";
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

export const useSpaceRace = (
  players: Player[],
  disableSave: boolean
): UseSpaceRace => {
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
      const updatedGame: SpaceRaceGame = updatePlayerDuplicateSquarePositions(
        playerId,
        {
          ...game,
          spacePlayers: updatePlayerHorizontalPosition(
            game.spacePlayers,
            playerId
          ),
        }
      );
      const updatedPlayer = updatedGame.spacePlayers[playerId];
      setGame(updatedGame);
      return updatedPlayer;
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
        const updatedPlayer = movePlayerHorizontally(playerToMove.id);
        if (updatedPlayer && !disableSave) {
          updatePlayerDetails(updatedPlayer.id, {
            gameMoves: updatedPlayer.courseMovesRemaining,
            spaceRace: {
              xCoordinate: updatedPlayer.currentPosition.x,
              yCoordinate: updatedPlayer.currentPosition.y,
            },
          });
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [game.spacePlayers, movePlayerHorizontally, disableSave]);

  useEffect(() => {
    Object.keys(playerQuery.questionsByPlayerId).forEach((playerId) => {
      const question = playerQuery.questionsByPlayerId[playerId];
      if (!question || question.id !== SPACE_COURSE_QUESTION_ID) return;
      if (question.selectedOptionIndex === undefined) return;

      const answer = question.options[question.selectedOptionIndex]!;
      const playerCourseAlreadyLockedIn =
        game.spacePlayers[playerId]?.plannedCourse.lockedIn;

      if (playerCourseAlreadyLockedIn) return;

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
      if (spacePlayer.courseMovesRemaining === 0) {
        return;
      }
      const upObstacle = getVerticalEntityBetween(
        spacePlayer.currentPosition,
        -MAX_COURSE_Y_OFFSET
      );
      const downObstacle = getVerticalEntityBetween(
        spacePlayer.currentPosition,
        MAX_COURSE_Y_OFFSET
      );

      const maxUp = upObstacle
        ? upObstacle.position.y - spacePlayer.currentPosition.y + 1
        : -MAX_COURSE_Y_OFFSET;

      const maxDown = downObstacle
        ? downObstacle.position.y - spacePlayer.currentPosition.y - 1
        : MAX_COURSE_Y_OFFSET;

      console.log("Up obstacle", spacePlayer.id, upObstacle);
      console.log("Down obstacle", spacePlayer.id, downObstacle);

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

    setGame({ ...game, uiState: { ...game.uiState, showGridlines: true } });
  }, [game, playerQuery]);

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

  const spacePlayersById = allPlayerIds.reduce<{
    [id: string]: SpaceRacePlayer;
  }>((acc, playerId) => {
    const player = players.find((p) => p.id === playerId);

    if (!player) {
      return acc;
    }

    const spaceRaceDetails = getPlayerSpaceRaceDetails(player);

    const gameMoves = player.details?.gameMoves || 0;

    return {
      ...acc,
      [playerId]: {
        id: player.id,
        name: player.name,
        color: player.details?.colourHex || "#770000",
        courseMovesRemaining: gameMoves,
        currentPosition: {
          x: spaceRaceDetails.xCoordinate,
          y: spaceRaceDetails.yCoordinate,
        },
        plannedCourse: {
          up: 0,
          right: 0,
          lockedIn: gameMoves === 0 ? true : false,
          movedVertically: gameMoves === 0 ? true : false,
          movedHorizontally: gameMoves === 0 ? true : false,
        },
      },
    };
  }, {});

  const defaultGame: SpaceRaceGame = {
    starmap: STARMAP_CHART,
    gameOver: false,
    spacePlayers: spacePlayersById,
    uiState: {
      showGridlines: true,
    },
  };

  const updatedGameWithPlayerPositionOffsets = Object.values(
    defaultGame.spacePlayers
  ).reduce<SpaceRaceGame>((acc, player) => {
    return updatePlayerDuplicateSquarePositions(player.id, acc);
  }, defaultGame);

  return updatedGameWithPlayerPositionOffsets;
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
  console.log(
    "finding horizontal entity between",
    currentPosition,
    horizontalDistance
  );

  for (
    let i = currentPosition.x;
    i <= horizontalDistance + currentPosition.x;
    i++
  ) {
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

      if (i < 0) {
        return createEntity("out-of-bounds", { x: currentPosition.x, y: -1 });
      }
    }
  }

  if (direction === "down") {
    for (
      let i = currentPosition.y;
      i <= verticalDistance + currentPosition.y;
      i++
    ) {
      const entity = STARMAP_CHART.entities.find(
        (entity) =>
          entity.position.x === currentPosition.x && entity.position.y === i
      );
      if (entity) {
        return entity;
      }

      if (i >= STARMAP_HEIGHT) {
        return createEntity("out-of-bounds", {
          x: currentPosition.x,
          y: STARMAP_HEIGHT,
        });
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

function updatePlayerDuplicateSquarePositions(
  playerId: string,
  spaceRaceGame: SpaceRaceGame
): SpaceRaceGame {
  const player = spaceRaceGame.spacePlayers[playerId];
  if (!player) return spaceRaceGame;

  const playerCoordinates = player.currentPosition;

  const otherPlayersInSameCoordinatesWithPositionOffset = Object.values(
    spaceRaceGame.spacePlayers
  )
    .filter(
      (p) =>
        p.currentPosition.x === playerCoordinates.x &&
        p.currentPosition.y === playerCoordinates.y
    )
    .map<SpaceRacePlayer>((p, i) => ({ ...p, positionOffset: i }));

  otherPlayersInSameCoordinatesWithPositionOffset.forEach((p) => {
    spaceRaceGame.spacePlayers[p.id] = p;
  });

  return spaceRaceGame;
}
