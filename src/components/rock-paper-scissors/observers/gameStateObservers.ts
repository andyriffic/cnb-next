import { RPSSpectatorGameView } from "../../../services/rock-paper-scissors/types";
import { Observer } from "../../../utils/observer";

export class MoveObserver implements Observer<RPSSpectatorGameView> {
  private lastMovesCount?: number;
  private onMoved: () => void;

  constructor(onMoved: () => void) {
    this.onMoved = onMoved;
  }

  update(current: RPSSpectatorGameView) {
    const currentMovesCount =
      current.roundHistory[current.roundHistory.length - 1]?.movedPlayerIds
        .length || 0;

    if (
      this.lastMovesCount !== undefined &&
      this.lastMovesCount < currentMovesCount
    ) {
      this.onMoved();
    }

    this.lastMovesCount = currentMovesCount;
  }
}
