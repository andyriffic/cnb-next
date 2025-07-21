import { generateRandomInt } from "./random";

export type Joke = {
  jokeText: string;
  answer: string;
};

const JOKES: Joke[] = [
  {
    jokeText: "Where does Dumbledore hide his army?",
    answer: "In his sleeve-y.",
  },
  {
    jokeText: "What's Hermione's favorite TV show?",
    answer: "Granger Things.",
  },
  {
    jokeText:
      "What did they call the Dark Lord when he stuck his finger in an electrical socket?",
    answer: "Volt-amort",
  },
  {
    jokeText: "Why did Barty Crouch Jr quit drinking?",
    answer: "It was making him Moody!",
  },
];

export function getRandomJokeId(): number {
  return generateRandomInt(0, JOKES.length - 1);
}

export function getRandomJoke(): Joke {
  //return getJokeIfExists(getRandomJokeId())!;
  return JOKES[3]!;
}

export function getJokeIfExists(jokeId: number | undefined): Joke | null {
  if (jokeId === undefined) {
    return null;
  }
  return JOKES[jokeId] || null;
}
