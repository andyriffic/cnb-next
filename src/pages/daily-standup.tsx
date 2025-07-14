import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { generateRandomInt, selectRandomOneOf } from "../utils/random";

type Joke = {
  jokeText: string;
  answer: string;
};

const JOKES = [
  // {
  //   jokeText: "Where does Dumbledore hide his army?",
  //   answer: "In his sleeve-y.",
  // },
  // {
  //   jokeText: "What's Hermione's favorite TV show?",
  //   answer: "Granger Things.",
  // },
  {
    jokeText:
      "What did they call the Dark Lord when he stuck his finger in an electrial socket?",
    answer: "Volt-amort",
  },
];

const Home = ({ joke }: { joke?: Joke }) => {
  if (!joke) {
    return <div>Joke not found</div>;
  }
  return (
    <div>
      <Head>
        <title>Finx Rocks!</title>
        <meta property="og:site_name" content="Cinby says:" />
        <meta property="og:title" content={joke.jokeText} />
        <meta property="og:description" content={joke.answer} />

        <meta
          property="og:url"
          content="https://cnb.finx-rocks.com/daily-standup"
        />
        <meta
          property="og:image"
          content="https://cnb.finx-rocks.com/images/cinby-laugh.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://cnb.finx-rocks.com/images/cinby-laugh.png"
        />

        <meta property="og:image:width" content="100" />
        <meta property="og:image:height" content="115" />
      </Head>
      <dl>
        <dt>{joke.jokeText}</dt>
        <dd>{joke.answer}</dd>
      </dl>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const jokeIndex = generateRandomInt(0, JOKES.length - 1);
  const joke = JOKES[jokeIndex];

  return {
    props: {
      joke: selectRandomOneOf(JOKES),
    },
  };
};

export default Home;
