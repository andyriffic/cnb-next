import type { GetServerSideProps } from "next";
import Head from "next/head";
import { getRandomJoke } from "../utils/joke";

type Joke = {
  jokeText: string;
  answer: string;
};

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
  const joke = getRandomJoke();

  return {
    props: {
      joke,
    },
  };
};

export default Home;
