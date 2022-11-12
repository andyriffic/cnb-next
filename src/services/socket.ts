//General socket functions

import { Socket } from "socket.io";

export function sendClientMessage(socket: Socket, message: string): void {
  socket.emit("server_message", message);
}
