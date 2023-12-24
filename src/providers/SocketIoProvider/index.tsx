import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_ENDPOINT } from "../../environment";
import { AiOverlordSocketService, useAiOverlord } from "./useAiOverlord";
import { GroupBettingSocketService, useGroupBetting } from "./useGroupBetting";
import {
  GroupJoinSocketService,
  useGroupPlayerJoin,
} from "./useGroupPlayerJoin";
import {
  RPSSocketService,
  useRockPaperScissorsSocket,
} from "./useRockPaperScissorsSocket";
import { GasGameSocketService, useGasGame } from "./useGasGame";
import { NumberCrunchSocketService, useNumberCrunch } from "./useNumberCrunch";

export type SocketIoService = {
  rockPaperScissors: RPSSocketService;
  groupJoin: GroupJoinSocketService;
  groupBetting: GroupBettingSocketService;
  aiOverlord: AiOverlordSocketService;
  gasGame: GasGameSocketService;
  numberCrunch: NumberCrunchSocketService;
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
  const groupJoinSocket = useGroupPlayerJoin(socket);
  const groupBettingSocket = useGroupBetting(socket);
  const aiOverlordSocket = useAiOverlord(socket);
  const gasGameSocket = useGasGame(socket);
  const numberCrunchSocket = useNumberCrunch(socket);

  return (
    <SocketIoContent.Provider
      value={{
        rockPaperScissors: rockPaperScissorsSocket,
        groupJoin: groupJoinSocket,
        groupBetting: groupBettingSocket,
        aiOverlord: aiOverlordSocket,
        gasGame: gasGameSocket,
        numberCrunch: numberCrunchSocket,
      }}
    >
      {/* <button onClick={() => socket.emit("hello", "are you there?")}>
        Send test
      </button>
      <button onClick={rockPaperScissorsSocket.createRPSGame}>
        Create Game
      </button>
 */}
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
