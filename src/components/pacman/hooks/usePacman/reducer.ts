import { Player } from "../../../../types/Player";
import { getPlayerIntegerAttributeValue } from "../../../../utils/string";
import {
  PacManBoard,
  PacManCharacter,
  PacManPlayer,
  PacManPlayerStatus,
} from "../../types";

export const MIN_PACMAN_MOVES = 25;
const TURNS_IN_JAIL = 2;

export type GameUiStatus =
  | "loading"
  | "ready"
  | "moving-players"
  | "moving-players-done"
  | "show-pacman-moves"
  | "ready-to-move-pacman"
  | "moving-pacman"
  | "game-over";

export type PacManUiState = {
  allPacPlayers: PacManPlayer[];
  pacMan: PacManCharacter;
  board: PacManBoard;
  status: GameUiStatus;
};

function createPacManPlayer(player: Player): PacManPlayer {
  return {
    player,
    status: "",
    offset: 0,
    movesRemaining: player.details?.gameMoves || 0,
    pathIndex: player.details?.pacmanDetails?.index || 0,
    color: player.details?.colourHex || "#FF0000",
    jailTurnsCount: player.details?.pacmanDetails?.jailTurnsRemaining || 0,
    powerPill: !!player.details?.pacmanDetails?.hasPowerPill,
    finishPosition: getPlayerIntegerAttributeValue(
      player.tags,
      "pac_finish",
      0
    ),
  };
}

export function createInitialState({
  allPlayers,
  board,
  team,
  pacmanStartingIndex,
}: {
  allPlayers: Player[];
  board: PacManBoard;
  team?: string;
  pacmanStartingIndex: number;
}): PacManUiState {
  const eligiblePlayers = allPlayers
    .filter((p) => !!p.details?.pacmanPlayer)
    .filter((p) => !team || p.details?.team === team);

  const initialState: PacManUiState = {
    allPacPlayers: eligiblePlayers.map(createPacManPlayer),
    status: "ready",
    board,
    pacMan: setPacManFacingDirection(
      {
        movesRemaining: 0,
        pathIndex: pacmanStartingIndex,
        status: "",
        facingDirection: "right",
      },
      board
    ),
  };

  return initialState.allPacPlayers.reduce(
    setPlayerPositionOffset,
    initialState
  );
}

type StartMovingPlayersAction = {
  type: "MOVE_PLAYERS";
};

type StartMovePacManAction = {
  type: "START_MOVE_PACMAN";
};

type MovePacManAction = {
  type: "MOVE_PACMAN";
};

type ReleasePlayersFromJailAction = {
  type: "RELEASE_PLAYERS_FROM_JAIL";
};

type SetGameUiStatus = {
  type: "SET_UI_STATE";
  payload: GameUiStatus;
};

export function reducer(
  state: PacManUiState,
  action:
    | StartMovingPlayersAction
    | MovePacManAction
    | StartMovePacManAction
    | ReleasePlayersFromJailAction
    | SetGameUiStatus
): PacManUiState {
  switch (action.type) {
    case "MOVE_PLAYERS": {
      return autoMovePlayer(state);
      // return pipe(
      //   state,
      //   autoMovePlayer
      // );
    }
    case "START_MOVE_PACMAN": {
      return setGameUiStatus("moving-pacman")(initialisePacmanMoves(state));
      // return pipe(
      //   state,
      //   initialisePacmanMoves,
      //   setGameUiStatus('moving-pacman')
      // );
    }
    case "MOVE_PACMAN": {
      if (state.pacMan.movesRemaining === 0) {
        return { ...state, status: "game-over" };
      }

      return sendPlayersToJail(movePacmanOneSquare(state));
      // return pipe(
      //   state,
      //   movePacmanOneSquare,
      //   sendPlayersToJail
      // );
    }
    case "RELEASE_PLAYERS_FROM_JAIL": {
      return setGameUiStatus("moving-players")(
        reduceJailCountForPlayers(state)
      );
      // return pipe(
      //   state,
      //   reduceJailCountForPlayers,
      //   setGameUiStatus('moving-players')
      // );
    }
    case "SET_UI_STATE": {
      return setGameUiStatus(action.payload)(state);
    }
    default: {
      return state;
    }
  }
}

function autoMovePlayer(state: PacManUiState): PacManUiState {
  const movingPlayer = state.allPacPlayers.find((p) => p.status === "moving");

  return !movingPlayer
    ? pickPlayerToMove(state)
    : movePlayer(movingPlayer, state);
}

function pickPlayerToMove(state: PacManUiState): PacManUiState {
  const nextPlayer = state.allPacPlayers
    .filter(playerNotInJail)
    .find((p) => p.movesRemaining > 0);

  if (!nextPlayer) {
    return setGameUiStatus("show-pacman-moves")(state);
    // return pipe(
    //   state,
    //   setGameUiStatus('moving-players-done')
    // );
  }

  return movePlayer(
    { ...nextPlayer, status: "moving" },
    { ...state, status: "moving-players" }
  );
}

function movePlayer(
  pacPlayer: PacManPlayer,
  state: PacManUiState
): PacManUiState {
  if (pacPlayer.movesRemaining === 0) {
    return setPlayerPositionOffset(
      updatePlayer({ ...pacPlayer, status: "" }, state),
      pacPlayer
    );
  }

  const atEnd = pacPlayer.pathIndex + 1 >= state.board.playerPath.length - 1;
  const finishPosition =
    !pacPlayer.finishPosition && atEnd
      ? getNextFinishPosition(state)
      : pacPlayer.finishPosition;

  return updatePlayer(
    {
      ...pacPlayer,
      offset: 0,
      movesRemaining: atEnd ? 0 : pacPlayer.movesRemaining - 1,
      pathIndex: atEnd
        ? state.board.playerPath.length - 1
        : pacPlayer.pathIndex + 1,
      finishPosition,
    },
    state
  );
}

function getNextFinishPosition(state: PacManUiState): number {
  const allFinishPositions = state.allPacPlayers.map((p) => p.finishPosition);
  return Math.max(...allFinishPositions) + 1;
}

function setPlayerStatus(
  player: PacManPlayer,
  status: PacManPlayerStatus
): PacManPlayer {
  return { ...player, status };
}

function setPlayerPositionOffset(
  state: PacManUiState,
  player: PacManPlayer
): PacManUiState {
  if (playerInJail(player)) {
    const updatedPlayers = state.allPacPlayers
      .filter(playerInJail)
      .map<PacManPlayer>((p, i) => ({ ...p, offset: i }));

    return updatePlayers(updatedPlayers)(state);
  } else {
    const updatedPlayers = state.allPacPlayers
      .filter((p) => p.pathIndex === player.pathIndex && p.jailTurnsCount === 0)
      .map<PacManPlayer>((p, i) => ({ ...p, offset: i }));

    return updatePlayers(updatedPlayers)(state);
  }

  // return pipe(
  //   state.allPacPlayers,
  //   A.filter(p => p.pathIndex === player.pathIndex && p.jailTurnsCount === 0),
  //   A.mapWithIndex<PacManPlayer, PacManPlayer>((index, player) => ({
  //     ...player,
  //     offset: index,
  //   })),
  //   updatePlayers
  // )(state);
}

export function getJailedPlayers(players: PacManPlayer[]): PacManPlayer[] {
  return players.filter(playerInJail);
}

export function sumPlayerMoves(players: PacManPlayer[]): number {
  return players
    .map<number>((p) => p.movesRemaining)
    .reduce((acc, v) => acc + v, 0);
}

function initialisePacmanMoves(state: PacManUiState): PacManUiState {
  const allPlayersInJail = getJailedPlayers(state.allPacPlayers);
  const totalMovesForPlayersInJail = sumPlayerMoves(allPlayersInJail);

  return {
    ...updatePlayers(allPlayersInJail.map(resetPlayersMoves))(state),
    pacMan: {
      ...state.pacMan,
      movesRemaining: totalMovesForPlayersInJail + MIN_PACMAN_MOVES,
    },
  };
}

function movePacmanOneSquare(state: PacManUiState): PacManUiState {
  const newPathIndex =
    state.pacMan.pathIndex + 1 >= state.board.pacManPath.length
      ? 0
      : state.pacMan.pathIndex + 1;

  return {
    ...state,
    pacMan: setPacManFacingDirection(
      {
        ...state.pacMan,
        movesRemaining: state.pacMan.movesRemaining - 1,
        pathIndex: newPathIndex,
      },
      state.board
    ),
  };
}

function reduceJailCountForPlayers(state: PacManUiState): PacManUiState {
  const updatedPlayersInJail = state.allPacPlayers
    .filter(playerInJail)
    .map(reducePlayerJailCount);

  // const playersInJail = pipe(
  //   state.allPacPlayers,
  //   A.filter(playerInJail),
  //   A.map(reducePlayerJailCount)
  // );

  return updatePlayers(updatedPlayersInJail)(state);
}

function playerNotInJail(player: PacManPlayer): boolean {
  return !playerInJail(player);
}

function playerInJail(player: PacManPlayer): boolean {
  return player.jailTurnsCount > 0;
}

function resetPlayersMoves(player: PacManPlayer): PacManPlayer {
  return {
    ...player,
    movesRemaining: 0,
  };
}

function reducePlayerJailCount(player: PacManPlayer): PacManPlayer {
  return {
    ...player,
    jailTurnsCount: player.jailTurnsCount - 1,
  };
}

function setGameUiStatus(
  status: GameUiStatus
): (state: PacManUiState) => PacManUiState {
  return (state) => {
    return {
      ...state,
      status,
    };
  };
}

function sendPlayersToJail(state: PacManUiState): PacManUiState {
  const pacManCoords =
    state.board.pacManPath[state.pacMan.pathIndex]!.coordinates;
  const playersGoingToJail = state.allPacPlayers
    .filter((p) => {
      const playerCoords = state.board.playerPath[p.pathIndex]!.coordinates;

      return (
        p.jailTurnsCount === 0 &&
        playerCoords.x === pacManCoords.x &&
        playerCoords.y === pacManCoords.y
      );
    })
    .map((p) => ({ ...p, jailTurnsCount: TURNS_IN_JAIL }))
    .map((p) => {
      return p.powerPill ? { ...p, jailTurnsCount: 0, powerPill: false } : p;
    });

  return updatePlayers(playersGoingToJail)(state);
}

function updatePlayers(
  pacPlayers: readonly PacManPlayer[]
): (state: PacManUiState) => PacManUiState {
  return (state) => {
    return {
      ...state,
      allPacPlayers: state.allPacPlayers.map((p) => {
        const updatedPlayer = pacPlayers.find(
          (up) => up.player.id === p.player.id
        );
        return updatedPlayer ? updatedPlayer : p;
      }),
    };
  };
}

function updatePlayer(
  pacPlayer: PacManPlayer,
  state: PacManUiState
): PacManUiState {
  return {
    ...state,
    allPacPlayers: state.allPacPlayers.map((p) =>
      p.player.id === pacPlayer.player.id ? pacPlayer : p
    ),
  };
}

function setPacManFacingDirection(
  pacMan: PacManCharacter,
  board: PacManBoard
): PacManCharacter {
  const currentPosition = board.pacManPath[pacMan.pathIndex]!;
  const nextPosition = board.pacManPath[pacMan.pathIndex + 1]
    ? board.pacManPath[pacMan.pathIndex + 1]
    : board.pacManPath[0];

  if (currentPosition.coordinates.x === nextPosition!.coordinates.x) {
    return pacMan;
  }

  return {
    ...pacMan,
    facingDirection:
      nextPosition!.coordinates.x > currentPosition.coordinates.x
        ? "right"
        : "left",
  };
}
