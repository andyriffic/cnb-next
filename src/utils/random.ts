export function shuffleArray<T>(array: Array<T>): Array<T> {
  const arrayCopy = [...array];
  return arrayCopy.sort(() => Math.random() - 0.5);
}
