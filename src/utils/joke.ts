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
  {
    jokeText: "Why did the protons vote for Harry as class president?",
    answer: "They didn't want to elect Ron!",
  },
  {
    jokeText: "How does Harry Potter enter a building?",
    answer: "Easy, he walks through a Gryffin-door!",
  },
  {
    jokeText: "What do you a Harry Potter fan riding a horse?",
    answer: "Harry Trotter. 🐴",
  },
  {
    jokeText:
      "What's the difference between Harry Potter and a spelling bee contestant?",
    answer: "One conjures spells and the other spells conjure!",
  },
  {
    jokeText: "Why did Snape give Harry Potter detention?",
    answer: "He was cursing in class!",
  },
  {
    jokeText: "Why did Harry Potter make a great computer programmer?",
    answer: "Because he spoke Python!",
  },
  {
    jokeText: "What is Harry Potter's favourite type of drink?",
    answer: "Something gin-ey!",
  },
  {
    jokeText: "What do you call Quidditch players who live together?",
    answer: "Broom mates!",
  },
  {
    jokeText: "Why did Harry Potter cross the road?",
    answer: "No reason, but a book will be written about it",
  },
];

export function getRandomJokeId(): number {
  return generateRandomInt(0, JOKES.length - 1);
}

export function getRandomJoke(): Joke {
  return getJokeIfExists(getRandomJokeId())!;
  // return JOKES[3]!;
}

export function getJokeIfExists(jokeId: number | undefined): Joke | null {
  if (jokeId === undefined) {
    return null;
  }
  return JOKES[jokeId] || null;
}
