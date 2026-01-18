import { generateRandomInt } from "./random";

export type Joke = {
  jokeText: string;
  answer: string;
};

const JOKES: Joke[] = [
  {
    jokeText: "Why did Harry Potter get lost in the forest?",
    answer: "Because he kept wand-ering off the trail.",
  },
  {
    jokeText: "Why doesn't Hogwarts have Wi-Fi?",
    answer:
      "Because they already have a strong connection to the Floo Network.",
  },
  {
    jokeText: "Why did the Muggle bring a ladder to Hogwarts?",
    answer: "Because they heard the standards were high.",
  },
  {
    jokeText: "What is a Death Eater's least favorite band?",
    answer: "The Grateful Dead.",
  },
  {
    jokeText: "Why did Snape stand in the middle of the road?",
    answer: "So you would not know which side he was on.",
  },
  {
    jokeText: "Why did Hermione bring a ruler to bed?",
    answer: "To see how long she slept.",
  },
  {
    jokeText: "Why are Slytherins good at basketball?",
    answer: "Because they know how to make a lot of sneaky passes.",
  },
  {
    jokeText: "What is Voldemort's favorite exercise?",
    answer: "Splitting hairs.",
  },
  {
    jokeText: "Why did the spell fail in class?",
    answer: "Because it did not have the proper incantation.",
  },
  {
    jokeText: "What do you call a wizard who tells dad jokes?",
    answer: "Pun-umbledore.",
  },
  {
    jokeText: "Why are ghosts terrible liars?",
    answer: "Because the truth always comes back to haunt them.",
  },
  {
    jokeText: "Why did the Quidditch player bring string to the match?",
    answer: "In case he needed to tie the score.",
  },
  {
    jokeText: "Why was the spellbook so calm?",
    answer: "Because it had all the answers.",
  },
  {
    jokeText: "Why did Harry bring a pencil to class?",
    answer: "In case he needed to draw his wand.",
  },
  {
    jokeText: "Why was the potion feeling insecure?",
    answer: "Because it was constantly being stirred up.",
  },
  {
    jokeText: "Why did Voldemort fail his job interview?",
    answer: "He could not explain the gap in his nose.",
  },
  {
    jokeText: "Why did the wizard bring a clock to class?",
    answer: "Because he wanted to learn about time turners.",
  },
  {
    jokeText: "Why did the Dementor fail its performance review?",
    answer: "He was sucking the joy out of every meeting.",
  },
  {
    jokeText: "Why did the Basilisk get a bad Yelp review?",
    answer: "Too many people said the service was petrifying.",
  },
  {
    jokeText: "Why did Lucius Malfoy hate casual Fridays?",
    answer: "Because it undermined the importance of dramatic cloaks.",
  },
  {
    jokeText: "Why did Hogwarts switch to Agile?",
    answer:
      "Because Dumbledore preferred sprint planning over long-term prophecies.",
  },
  {
    jokeText: "Why did the Hogwarts website never go down?",
    answer: "Because it was hosted on Platform Nine and Three-Quarters.",
  },
  {
    jokeText: "Why did Dobby become a product manager?",
    answer: "Because he was very focused on user freedom.",
  },
  {
    jokeText: "Why did the Basilisk trigger an incident alert?",
    answer: "Because everyone froze at once.",
  },
  {
    jokeText: "Why is the Room of Requirement so depenable",
    answer: "Because it scales on demand.",
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
