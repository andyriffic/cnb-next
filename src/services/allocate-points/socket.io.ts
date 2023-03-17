import { Server as SocketIOServer, Socket } from "socket.io";
import { RockPaperScissorsPoints } from "../rock-paper-scissors/points";
import { sendClientMessage } from "../socket";

export enum ALLOCATE_POINTS_ACTIONS {
  ALLOCATE_POINTS = "ALLOCATE_POINTS",
}

export type AllocatePointsHandler = (
  id: string,
  points: RockPaperScissorsPoints,
  onAllocated: () => void
) => void;

let pointsAlreadyAllocatedIds: string[] = [];

export function initialiseGroupBettingSocket(
  io: SocketIOServer,
  socket: Socket
): void {
  const allocatePointsHandler: AllocatePointsHandler = (
    id,
    points,
    onAllocated
  ) => {
    console.log("assigning points", id, points);
    onAllocated();
  };
  console.log("Registering Allocate Points SocketIo 🔌");

  socket.on(ALLOCATE_POINTS_ACTIONS.ALLOCATE_POINTS, allocatePointsHandler);
  sendClientMessage(socket, "Welcome to Allocate Points 💰");
}
