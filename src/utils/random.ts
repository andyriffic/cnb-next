import random from "random";

export function shuffleArray<T>(array: Array<T>): Array<T> {
  const arrayCopy = [...array];
  return arrayCopy.sort(() => Math.random() - 0.5);
}

export function selectRandomOneOf<T>(items: T[]): T {
  const randomItemIndex = random.int(0, items.length - 1);
  return items[randomItemIndex]!;
}

export type WeightedItem<T> = {
  weight: number;
  item: T;
};
