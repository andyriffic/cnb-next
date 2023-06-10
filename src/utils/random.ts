import random from "random";

export function shuffleArray<T>(array: Array<T>): Array<T> {
  const arrayCopy = [...array];
  return arrayCopy.sort(() => random.float() - 0.5);
}

export function selectRandomOneOf<T>(items: T[]): T {
  const randomItemIndex = random.int(0, items.length - 1);
  return items[randomItemIndex]!;
}

export function selectWeightedRandomOneOf<T>(
  weightedList: WeightedItem<T>[]
): T {
  // https://medium.com/@peterkellyonline/weighted-random-selection-3ff222917eb6
  const totalWeights = weightedList.reduce((acc, weightedItem) => {
    return acc + weightedItem.weight;
  }, 0);

  let randomWeight = random.int(1, totalWeights);
  let randomItem: WeightedItem<T>;
  for (let i = 0; i < weightedList.length; i++) {
    randomWeight -= weightedList[i]!.weight;
    if (randomWeight <= 0) {
      randomItem = weightedList[i]!;
      break;
    }
  }

  return randomItem!.item;
}

export type WeightedItem<T> = {
  weight: number;
  item: T;
};
