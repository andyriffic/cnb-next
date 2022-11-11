import { Socket, Server as SocketIOServer } from "socket.io";
import { sendClientMessage } from "../socket";

export enum PLAYER_JOIN_ACTIONS {
  JOIN_GROUP_UPDATE = "JOIN_GROUP_UPDATE",
  CREATE_JOIN_GROUP = "CREATE_JOIN_GROUP",
  PLAYER_JOIN_GROUP = "PLAYER_JOIN_GROUP",
}

export default function initialise(io: SocketIOServer, socket: Socket): void {
  console.log("Registering Player Join SocketIo 🔌");

  //   socket.emit(RPS_ACTIONS.GAME_UPDATE, inMemoryGames.map(createGameView));
  sendClientMessage(socket, "Welcome to Player Join service 👨‍👩‍👧‍👦");
}
