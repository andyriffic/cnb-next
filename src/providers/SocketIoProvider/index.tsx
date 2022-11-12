import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_ENDPOINT } from "../../environment";
import { RPSSpectatorGameView } from "../../services/rock-paper-scissors/types";
import {
  RPSSocketService,
  useRockPaperScissorsSocket,
} from "./useRockPaperScissorsSocket";

type SocketIoService = {
  rockPaperScissors: RPSSocketService;
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

    socket.on("server_message", (message) => {
      console.info(message);
    });

    socket.connect();

    return () => {
      console.log("Disconnecting client");
      socket.off("disconnect");
      socket.off("connect");
      socket.off("server_message");
      socket.io.off("error");
      socket.disconnect();
    };
  }, []);

  const rockPaperScissorsSocket = useRockPaperScissorsSocket(socket);

  return (
    <SocketIoContent.Provider
      value={{ rockPaperScissors: rockPaperScissorsSocket }}
    >
      <button onClick={() => socket.emit("hello", "are you there?")}>
        Send test
      </button>
      <button onClick={rockPaperScissorsSocket.createRPSGame}>
        Create Game
      </button>

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
