import { RPSSpectatorGameView } from "../../services/rock-paper-scissors/types";
import { Observer, RockPaperScissorsSubject } from "../../utils/observer";

const DebugObserver: Observer<RPSSpectatorGameView> = {
  update: (current) => {
    console.log("OBSERVER [Current]", current);
  },
};

class MoveObserver implements Observer<RPSSpectatorGameView> {
  private lastMovesCount?: number;
  private onMoved: () => void;

  constructor(onMoved: () => void) {
    this.onMoved = onMoved;
  }

  update(current: RPSSpectatorGameView) {
    const currentMovesCount =
      current.rounds[current.rounds.length - 1]?.movedPlayerIds.length || 0;

    if (
      this.lastMovesCount !== undefined &&
      this.lastMovesCount < currentMovesCount
    ) {
      this.onMoved();
    }

    this.lastMovesCount = currentMovesCount;
  }
}

export const RPSGameSubject = new RockPaperScissorsSubject();
const MoveSounds = new MoveObserver(() => console.log("PLAY SOUND"));

RPSGameSubject.attach(DebugObserver);
RPSGameSubject.attach(MoveSounds);
