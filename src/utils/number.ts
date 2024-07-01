export function isNumberInRange(
  num: number,
  min: number,
  max: number
): boolean {
  return num >= min && num <= max;
}

export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

// Median = the middle value when the array is sorted
export function calculateMedian(numbers: number[]): number | null {
  if (numbers.length === 0) {
    return null; // Return null if the array is empty
  }

  const sortedNumbers = numbers.slice().sort((a, b) => a - b);

  const middleIndex = Math.floor(sortedNumbers.length / 2);

  if (sortedNumbers.length % 2 === 0) {
    // If the array length is even, median is the average of the two middle values
    return Math.floor(
      (sortedNumbers[middleIndex - 1]! + sortedNumbers[middleIndex]!) / 2
    );
  } else {
    // If the array length is odd, median is the middle value
    return sortedNumbers[middleIndex]!;
  }
}
