import random from "random";

export function shuffleArray<T>(array: Array<T>): Array<T> {
  const arrayCopy = [...array];
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = random.int(0, i); // Generate a random index between 0 and i.
    // Swap elements at i and j.
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j]!, arrayCopy[i]!];
  }
  return arrayCopy;
}

export function selectRandomOneOf<T>(items: T[]): T {
  const randomItemIndex = random.int(0, items.length - 1);
  return items[randomItemIndex]!;
}

export function generateRandomInt(min: number, max: number): number {
  return random.int(min, max);
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
