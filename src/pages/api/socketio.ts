import { Server as NetServer, Socket } from "net";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { initialiseGroupJoinSocket } from "../../services/player-join/socket.io";
import { initialiseRockPaperScissorsSocket } from "../../services/rock-paper-scissors/socket.io";
import { initialiseGroupBettingSocket } from "../../services/betting/socket.io";
import { initialiseAiOverlordSocket } from "../../services/ai-overlord/socket.io";

type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: "/api/socketio",
    });

    io.on("connection", (socket) => {
      console.log("Socket Connected (server) 🎉", socket.id);

      initialiseRockPaperScissorsSocket(io, socket);
      initialiseGroupJoinSocket(io, socket);
      initialiseGroupBettingSocket(io, socket);
      initialiseAiOverlordSocket(io, socket);

      socket.on("hello", (message: string) => {
        console.log("🔈", message);
      });
    });

    io.on("error", (error) => {
      console.error("Server error:", error);
    });

    io.on("connect_error", (error) => {
      console.error("Server error:", error);
    });

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  } else {
    console.log("Socket already connected");
  }
  res.end();
}
