import { RPSSpectatorGameView } from "../../services/rock-paper-scissors/types";

export interface Subject<T> {
  attach(observer: Observer<T>): void;
  detach(observer: Observer<T>): void;
  notify(previous: T | undefined, current: T): void;
}

export interface Observer<T> {
  update(previous: T | undefined, current: T): void;
}

export class RockPaperScissorsSubject implements Subject<RPSSpectatorGameView> {
  private observers: Observer<RPSSpectatorGameView>[] = [];
  private previous: RPSSpectatorGameView | undefined;

  attach(observer: Observer<RPSSpectatorGameView>): void {
    //TODO: check if observer is already attached
    this.observers.push(observer);
  }

  detach(observer: Observer<RPSSpectatorGameView>): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notify(obj: RPSSpectatorGameView): void {
    this.observers.forEach((o) => o.update(this.previous, obj));
    this.previous = obj;
  }
}
