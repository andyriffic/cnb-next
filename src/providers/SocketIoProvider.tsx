import React, { useCallback, useEffect, useMemo, useState } from "react";
import { customAlphabet } from "nanoid";
import { io } from "socket.io-client";
import { SOCKET_ENDPOINT } from "../environment";
import { RPS_ACTIONS } from "../services/games/rockPaperScissors/socket.io";
import {
  RPSGame,
  RPSPlayerMove,
} from "../services/games/rockPaperScissors/types";

const generateGameId = customAlphabet("1234567890");

type SocketIoService = {
  activeRPSGames: RPSGame[];
  makeGameMove: (move: RPSPlayerMove, gameId: string) => void;
  resolveGameRound: (gameId: string) => void;
};

type Props = {
  children: React.ReactNode;
};

console.log("Trying to connect to", SOCKET_ENDPOINT);
const socket = io("/", {
  path: "/api/socketio",
  autoConnect: false,
});

const SocketIoContent = React.createContext<SocketIoService | undefined>(
  undefined
);

export const SocketIoProvider = ({ children }: Props): JSX.Element => {
  const [activeRPSGames, setActiveRPSGames] = useState<RPSGame[]>([]);

  useEffect(() => {
    console.log("Setting up socket connection");

    socket.on("connect", () => {
      console.log("Client connected socket", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.io.on("error", (error) => {
      console.error("Client connection error", error);
    });

    socket.on(RPS_ACTIONS.GAME_UPDATE, (games: RPSGame[]) => {
      console.log("Socket useEffect", RPS_ACTIONS.GAME_UPDATE, games);
      setActiveRPSGames(games);
    });

    socket.on("server_message", (message) => {
      console.info(message);
    });

    socket.connect();

    return () => {
      console.log("Disconnecting client");
      socket.off("disconnect");
      socket.off("connect");
      socket.off(RPS_ACTIONS.GAME_UPDATE);
      socket.off("server_message");
      socket.io.off("error");
      socket.disconnect();
    };
  }, []);

  const createRPSGame = useCallback(
    () =>
      socket.emit(
        RPS_ACTIONS.CREATE_GAME,
        { id: generateGameId(4), playerIds: ["andy", "alex"] },
        (gameId: string) => console.log("create", gameId)
      ),
    []
  );

  const makeGameMove = useCallback(
    (move: RPSPlayerMove, gameId: string) =>
      socket.emit(RPS_ACTIONS.MAKE_MOVE, move, gameId),
    []
  );

  const resolveGameRound = useCallback(
    (gameId: string) => socket.emit(RPS_ACTIONS.RESOLVE_ROUND, gameId),
    []
  );

  return (
    <SocketIoContent.Provider
      value={{ activeRPSGames, makeGameMove, resolveGameRound }}
    >
      <button onClick={() => socket.emit("hello", "are you there?")}>
        Send test
      </button>
      <button onClick={createRPSGame}>Create Game</button>

      {children}
    </SocketIoContent.Provider>
  );
};

export function useSocketIo(): SocketIoService {
  const context = React.useContext(SocketIoContent);
  if (context === undefined) {
    throw new Error("useSocketIo must be used within a SocketIoProvider");
  }
  return context;
}

export function useRPSGame(gameId: string): {
  game: RPSGame | undefined;
  makeMove: (move: RPSPlayerMove) => void;
  resolveRound: () => void;
} {
  const { activeRPSGames, makeGameMove, resolveGameRound } = useSocketIo();

  const game = useMemo(() => {
    console.log("useRPSGame", activeRPSGames, gameId);

    return activeRPSGames.find((g) => g.id === gameId);
  }, [gameId, activeRPSGames]);

  const makeMove = useCallback(
    (move: RPSPlayerMove) => {
      return makeGameMove(move, gameId);
    },
    [gameId, makeGameMove]
  );

  const resolveRound = useCallback(() => {
    return resolveGameRound(gameId);
  }, [gameId, resolveGameRound]);

  return { game, makeMove, resolveRound };
}
