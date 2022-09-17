import type { NextPage } from "next";
import styled from "styled-components";
import Head from "next/head";

const Heading = styled.h1`
  color: red;
`;

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <Heading>Hello</Heading>
    </div>
  );
};

export default Home;
