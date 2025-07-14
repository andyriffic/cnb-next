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
];

export function getRandomJokeId(): number {
  return generateRandomInt(0, JOKES.length - 1);
}

export function getJokeIfExists(jokeId: number | undefined): Joke | null {
  if (!jokeId) {
    return null;
  }
  return JOKES[jokeId] || null;
}
