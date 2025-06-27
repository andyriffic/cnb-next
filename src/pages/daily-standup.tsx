import type { NextPage } from "next";
import Head from "next/head";
import { generateRandomInt } from "../utils/random";

const Home: NextPage = () => {
  return (
    <Head>
      <title>Finx Rocks!</title>
      <meta property="og:title" content="Finx Rocks!" />
      <meta
        property="og:description"
        content={`Welcome to daily facilitator page: ${
          generateRandomInt(0, 2) === 0 ? "variant 1" : "variant 2"
        }`}
      />
      <meta property="og:image" content="//images/finx-mascot.png" />
      <meta property="og:image:width" content="50" />
      <meta property="og:image:height" content="50" />
    </Head>
  );
};

export default Home;
