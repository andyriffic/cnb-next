import { RPSSpectatorGameView } from "../../services/rock-paper-scissors/types";

export interface Subject<T> {
  attach(observer: Observer<T>): void;
  detach(observer: Observer<T>): void;
  notify(obj: T): void;
}

export interface Observer<T> {
  update(obj: T): void;
}

class RockPaperScissorsSubject implements Subject<RPSSpectatorGameView> {
  private observers: Observer<RPSSpectatorGameView>[] = [];
  private gameView: RPSSpectatorGameView | undefined;

  attach(observer: Observer<RPSSpectatorGameView>): void {
    //TODO: check if observer is already attached
    this.observers.push(observer);
  }

  detach(observer: Observer<RPSSpectatorGameView>): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notify(): void {
    this.observers.forEach(
      (o) => this.gameView !== undefined && o.update(this.gameView)
    );
  }
}
