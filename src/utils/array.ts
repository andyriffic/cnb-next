export function shuffleArrayJestSafe<T>(array: T[]): T[] {
  //Had issues with Jest compiling when using the random library in the random.ts file
  //Created this as a workaround for now

  // Create a copy of the array to avoid mutating the original
  const shuffledArray = [...array];

  // Loop through the array from the last index to the first
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap the elements at indices i and j
    [shuffledArray[i], shuffledArray[j]] = [
      shuffledArray[j]!,
      shuffledArray[i]!,
    ];
  }

  return shuffledArray;
}
