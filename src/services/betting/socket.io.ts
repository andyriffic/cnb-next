import { Socket, Server as SocketIOServer } from "socket.io";
import { sendClientMessage } from "../socket";

export enum BETTING_ACTIONS {
  CREATE_BETTING_ROUND = "CREATE_BETTING_ROUND",
  MAKE_PLAYER_BET = "MAKE_PLAYER_BET",
  GET_BETTING_RESULTS = "GET_BETTING_RESULTS",
}

export default function initialise(io: SocketIOServer, socket: Socket): void {
  console.log("Registering Betting SocketIo 🔌");

  //   socket.emit(RPS_ACTIONS.GAME_UPDATE, inMemoryGames.map(createGameView));
  sendClientMessage(socket, "Welcome to Betting 💰");
}
