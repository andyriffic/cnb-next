import { useCallback, useEffect, useMemo, useState } from "react";
import { pipe } from "fp-ts/lib/function";
import { getPlayerSpaceRaceDetails, Player } from "../../types/Player";
import { selectRandomOneOf } from "../../utils/random";
import { clamp } from "../../utils/number";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { useSound } from "../hooks/useSound";
import {
  QueryUserOption,
  QueryUserQuestion,
} from "../../services/query-user/types";
import { updatePlayerDetails } from "../../utils/api";
import { createEntity, STARMAP_CHART, STARMAP_HEIGHT } from "./constants";
import {
  PlannedCourse,
  SpacePlayersById,
  SpaceRaceCoordinates,
  SpaceRaceEntity,
  SpaceRaceGame,
  SpaceRacePlayer,
  SpaceRaceRocketTrail,
  SpaceRaceStarmap,
} from "./types";

const SPACE_COURSE_QUESTION_ID = "SPACERACE_COURSE";
const REMOVE_OBSTACLE_DISTANCE = 3;

const MAX_COURSE_Y_OFFSET = 2;

const FIND_ME_QUESTION_ID = "space-race-find-me";
const FIND_ME_OPTION = "find-me";
const DONT_FIND_ME_OPTION = "dont-find-me";

export type UseSpaceRace = {
  spaceRaceGame: SpaceRaceGame;
  plotPlayerCourse: (playerId: string, up: number) => void;
  movePlayerVertically: (playerId: string) => void;
  movePlayerHorizontally: (playerId: string) => void;
  randomlyPlotAllPlayerCourses: () => void;
  sendCourseQuestionToPlayers: () => void;
  sendLocationQuestionToPlayers: () => void;
  highlightPlayer: (playerId: string) => void;
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
        ...updatePlayerVerticalPosition(game, playerId),
      });
    },
    [game]
  );

  const highlightPlayer = useCallback(
    (playerId: string) => {
      return setGame({
        ...setPlayerHighlight(game, playerId),
      });
    },
    [game]
  );

  const movePlayerHorizontally = useCallback(
    (playerId: string) => {
      const updatedGame: SpaceRaceGame = updatePlayerDuplicateSquarePositions(
        playerId,
        updatePlayerHorizontalPosition(game, playerId, game.starmap)
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

  //Check answers of course question
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
  }, [game.spacePlayers, playerQuery, plotPlayerCourse]);

  //Check answers of location question
  useEffect(() => {
    Object.keys(playerQuery.questionsByPlayerId).forEach((playerId) => {
      const question = playerQuery.questionsByPlayerId[playerId];
      if (!question || question.id !== FIND_ME_QUESTION_ID) return;
      if (question.selectedOptionIndex === undefined) return;

      const answer = question.options[question.selectedOptionIndex]!;
      const alreadyHighlighted = !!game.spacePlayers[playerId]?.highlight;
      const dontWantToBeFound = answer.value === DONT_FIND_ME_OPTION;

      if (!alreadyHighlighted && !dontWantToBeFound) {
        setGame(setPlayerHighlight(game, playerId));
      }

      const courseQuestion = createCourseQuestionForPlayer(
        game.spacePlayers[playerId]!,
        game
      );
      if (courseQuestion) {
        playerQuery.createPlayerQuestion(playerId, courseQuestion);
      }
    });
  }, [game, playerQuery]);

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

  const sendCourseQuestionToPlayers = useCallback(() => {
    Object.values(game.spacePlayers).forEach((spacePlayer) => {
      const courseQuestion = createCourseQuestionForPlayer(spacePlayer, game);
      if (!courseQuestion) return;

      playerQuery.createPlayerQuestion(spacePlayer.id, courseQuestion);
    });

    setGame({ ...game, uiState: { ...game.uiState, showGridlines: true } });
  }, [game, playerQuery]);

  const sendLocationQuestionToPlayers = useCallback(() => {
    const FIND_ME_OPTION = "find-me";
    const DONT_FIND_ME_OPTION = "dont-find-me";

    Object.values(game.spacePlayers).forEach((spacePlayer) => {
      if (spacePlayer.courseMovesRemaining === 0) {
        return;
      }

      const allOptions: QueryUserOption<string>[] = [
        { text: "Find me", value: FIND_ME_OPTION },
        { text: "Dont find me", value: DONT_FIND_ME_OPTION },
      ];

      playerQuery.createPlayerQuestion(spacePlayer.id, {
        id: FIND_ME_QUESTION_ID,
        question: "Do you know where you are?",
        style: "normal",
        options: allOptions,
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
    sendCourseQuestionToPlayers,
    highlightPlayer,
    sendLocationQuestionToPlayers,
  };
};

function createPlayer(player: Player): SpaceRacePlayer {
  const spaceRaceDetails = getPlayerSpaceRaceDetails(player);

  const gameMoves = player.details?.gameMoves || 0;

  return {
    id: player.id,
    name: player.name,
    color: player.details?.colourHex || "#770000",
    courseMovesRemaining: gameMoves,
    highlight: false,
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
  };
}

function createCourseQuestionForPlayer(
  spacePlayer: SpaceRacePlayer,
  game: SpaceRaceGame
): QueryUserQuestion<number> | undefined {
  if (spacePlayer.courseMovesRemaining === 0) {
    return;
  }
  const upObstacle = getVerticalEntityBetween(
    spacePlayer.currentPosition,
    -MAX_COURSE_Y_OFFSET,
    game.starmap
  );
  const downObstacle = getVerticalEntityBetween(
    spacePlayer.currentPosition,
    MAX_COURSE_Y_OFFSET,
    game.starmap
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

  return {
    id: SPACE_COURSE_QUESTION_ID,
    question: "Plot your course 規劃你的路線",
    style: "emoji-stack",
    options: allCourseOptions,
  };
}

function createSpaceRaceGame(players: Player[]): SpaceRaceGame {
  const allPlayerIds = players.map((player) => player.id);

  const spacePlayersById = allPlayerIds.reduce((acc, playerId) => {
    const player = players.find((p) => p.id === playerId);

    if (!player) {
      return acc;
    }

    return {
      ...acc,
      [playerId]: createPlayer(player),
    };
  }, {});

  const defaultGame: SpaceRaceGame = {
    starmap: STARMAP_CHART,
    gameOver: false,
    spacePlayers: spacePlayersById,
    uiState: {
      showGridlines: false,
    },
    voidXDistance: 0,
    rocketTrails: [],
  };

  const updatedGameWithPlayerPositionOffsets = Object.values(
    defaultGame.spacePlayers
  ).reduce<SpaceRaceGame>((acc, player) => {
    return updatePlayerDuplicateSquarePositions(player.id, acc);
  }, defaultGame);

  return pipe(updatedGameWithPlayerPositionOffsets, removeTrailingObstacles);
}

function getVoidXPosition(game: SpaceRaceGame): number {
  const leadingPlayerXPosition = getLeadingPlayerIndex(game);
  return Math.max(leadingPlayerXPosition - REMOVE_OBSTACLE_DISTANCE, 0);
}

function getLeadingPlayerIndex(game: SpaceRaceGame): number {
  const allPlayerXPositions = Object.values(game.spacePlayers).map(
    (p) => p.currentPosition.x
  );
  const maxXPosition = Math.max(...allPlayerXPositions);
  return maxXPosition;
}

function removeTrailingObstacles(game: SpaceRaceGame): SpaceRaceGame {
  const xPositionToRemoveObstaclesBefore = getVoidXPosition(game);

  const removedObstacles = game.starmap.entities.filter(
    (e) => e.position.x >= xPositionToRemoveObstaclesBefore || !e.removable
  );
  return {
    ...game,
    starmap: {
      ...game.starmap,
      entities: removedObstacles,
    },
    voidXDistance: xPositionToRemoveObstaclesBefore,
  };
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

function setPlayerHighlight(
  spaceRaceGame: SpaceRaceGame,
  playerId: string
): SpaceRaceGame {
  console.log("finding player", playerId);

  const player = spaceRaceGame.spacePlayers[playerId];
  if (!player) return spaceRaceGame;

  console.log("Highlighting player", playerId);

  return {
    ...spaceRaceGame,
    spacePlayers: {
      ...spaceRaceGame.spacePlayers,
      [playerId]: {
        ...player,
        highlight: true,
      },
    },
  };
}
function updatePlayerVerticalPosition(
  spaceRaceGame: SpaceRaceGame,
  playerId: string
): SpaceRaceGame {
  const player = spaceRaceGame.spacePlayers[playerId];
  if (!player) return spaceRaceGame;
  if (!player.plannedCourse.lockedIn) return spaceRaceGame;

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

  const newTrail: SpaceRaceRocketTrail = {
    start: player.plannedCourse.up > 0 ? player.currentPosition : newPosition,
    size: Math.abs(player.plannedCourse.up),
    direction: "vertical",
    color: player.color,
  };

  return {
    ...spaceRaceGame,
    rocketTrails: [...spaceRaceGame.rocketTrails, newTrail],
    spacePlayers: {
      ...spaceRaceGame.spacePlayers,
      [playerId]: {
        ...player,
        currentPosition: newPosition,
        plannedCourse: newPlannedCourse,
      },
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
  horizontalDistance: number,
  starmap: SpaceRaceStarmap
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
    const entity = starmap.entities.find(
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
  verticalDistance: number,
  starmap: SpaceRaceStarmap
): SpaceRaceEntity | undefined {
  if (verticalDistance === 0) return;

  const direction = verticalDistance < 0 ? "up" : "down";

  if (direction === "up") {
    for (let i = currentPosition.y; i >= verticalDistance; i--) {
      const entity = starmap.entities.find(
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
      const entity = starmap.entities.find(
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

function getEndingCooridinates(
  player: SpaceRacePlayer,
  spacePlayers: SpacePlayersById,
  starmap: SpaceRaceStarmap
): {
  entity?: SpaceRaceEntity;
  coordinates: SpaceRaceCoordinates;
} {
  const entity = getHorizontalEntityBetween(
    player.currentPosition,
    player.plannedCourse.right,
    starmap
  );

  if (!entity) {
    return {
      coordinates: {
        x: player.currentPosition.x + Math.abs(player.plannedCourse.right),
        y: player.currentPosition.y,
      },
    };
  }

  if (entity.behaviour === "finish") {
    console.log("Checking other player finished...", spacePlayers);
    const otherPlayerFinished = Object.values(spacePlayers).find(
      (p) =>
        p.id !== player.id &&
        p.currentPosition.x === entity.position.x &&
        p.currentPosition.y === entity.position.y
    );
    console.log("Other player finished", otherPlayerFinished);
    if (otherPlayerFinished) {
      entity.behaviour = "block"; //Not really happy about this mutation but hey whaddayagonnado
    }
  }

  if (entity.behaviour === "block") {
    return {
      entity,
      coordinates: { x: entity.position.x - 1, y: player.currentPosition.y },
    };
  }

  return {
    entity,
    coordinates: { ...entity.position },
  };
}

function updatePlayerHorizontalPosition(
  spaceRaceGame: SpaceRaceGame,
  playerId: string,
  starmap: SpaceRaceStarmap
): SpaceRaceGame {
  const player = spaceRaceGame.spacePlayers[playerId];
  if (!player) return spaceRaceGame;
  if (!player.plannedCourse.lockedIn) return spaceRaceGame;

  const moveResult = getEndingCooridinates(
    player,
    spaceRaceGame.spacePlayers,
    starmap
  );

  const newPlannedCourse = {
    ...player.plannedCourse,
    right: 0,
    lockedIn: true,
    movedHorizontally: true,
  };

  const newTrail: SpaceRaceRocketTrail = {
    start: player.currentPosition,
    size: moveResult.coordinates.x - player.currentPosition.x,
    direction: "horizontal",
    color: player.color,
  };

  return {
    ...spaceRaceGame,
    rocketTrails: [...spaceRaceGame.rocketTrails, newTrail],
    spacePlayers: {
      ...spaceRaceGame.spacePlayers,
      [playerId]: {
        ...setPlayerCoordinates(player, moveResult.coordinates),
        plannedCourse: newPlannedCourse,
        collidedWith: moveResult.entity,
      },
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
