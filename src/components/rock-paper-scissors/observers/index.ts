import { RPSSpectatorGameView } from "../../../services/rock-paper-scissors/types";
import { Observer, RockPaperScissorsSubject } from "../../../utils/observer";
import { MoveObserver } from "./gameStateObservers";

const DebugObserver: Observer<RPSSpectatorGameView> = {
  update: (current) => {
    console.log("OBSERVER [Current]", current);
  },
};

export const RPSGameSubject = new RockPaperScissorsSubject();
const MoveSounds = new MoveObserver(() => console.log("PLAY SOUND"));

RPSGameSubject.attach(DebugObserver);
RPSGameSubject.attach(MoveSounds);
