import { RPSSpectatorGameView } from "../../services/rock-paper-scissors/types";
import { Observer, RockPaperScissorsSubject } from "../../utils/observer";

const DebugObserver: Observer<RPSSpectatorGameView> = {
  update: (previous, current) => {
    console.log("OBSERVER [Previous]", previous);
    console.log("OBSERVER [Current]", current);
  },
};

class MoveObserver implements Observer<RPSSpectatorGameView> {
  private lastMovesCount?: number;
  private onMoved: () => void;

  constructor(onMoved: () => void) {
    this.onMoved = onMoved;
  }

  update(
    previous: RPSSpectatorGameView | undefined,
    current: RPSSpectatorGameView
  ): void {
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

const hasMoved = (
  previousGame: RPSSpectatorGameView | undefined,
  currentGame: RPSSpectatorGameView
): boolean => {
  const currentMovesCount =
    currentGame.rounds[currentGame.rounds.length - 1]?.movedPlayerIds.length ||
    0;

  const previousMovesCount =
    previousGame?.rounds[previousGame?.rounds.length - 1]?.movedPlayerIds
      .length;

  const hasMoved = previousMovesCount
    ? currentMovesCount > previousMovesCount
    : currentMovesCount > 0;

  return hasMoved;
};

const moveObserverFunc: Observer<RPSSpectatorGameView> = {
  update: (previous, current) => {
    console.log("MoveObserver", hasMoved(previous, current));
  },
};

export const RPSGameSubject = new RockPaperScissorsSubject();
const MoveSounds = new MoveObserver(() => console.log("PLAY SOUND"));

RPSGameSubject.attach(DebugObserver);
RPSGameSubject.attach(moveObserverFunc);
RPSGameSubject.attach(MoveSounds);
