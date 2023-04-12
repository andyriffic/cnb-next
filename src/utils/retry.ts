type RetryCondition<T> = (result: T) => boolean;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retryFunction<T>(
  fn: () => Promise<T>,
  retries: number,
  condition: RetryCondition<T>,
  delayMs: number
): Promise<T> {
  let attempts = 0;

  while (attempts < retries) {
    try {
      const result = await fn();

      if (condition(result)) {
        console.log("Condition met after", attempts, "attempts");
        return result;
      } else {
        attempts++;
      }
    } catch (error) {
      attempts++;
      if (attempts >= retries) {
        throw error;
      }
    }

    if (attempts < retries) {
      await delay(delayMs);
    }
  }

  throw new Error("Maximum retries reached without meeting the condition");
}
