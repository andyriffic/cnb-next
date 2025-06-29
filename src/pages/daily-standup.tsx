import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { selectRandomOneOf } from "../utils/random";

type Joke = {
  jokeText: string;
  answer: string;
};

const JOKES = [
  {
    jokeText: "Why did the scarecrow win an award?",
    answer: " Because he was outstanding in his field!",
  },
  {
    jokeText: "Why don't scientists trust atoms?",
    answer: " Because they make up everything!",
  },
  { jokeText: "What do you call fake spaghetti?", answer: " An impasta!" },
];

const Home = ({ joke }: { joke: Joke }) => {
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
  return {
    props: {
      joke: selectRandomOneOf(JOKES),
    },
  };
};

export default Home;
