import type { GetServerSideProps } from "next";
import Head from "next/head";
import { pipe } from "fp-ts/lib/function";
import Link from "next/link";
import styled from "styled-components";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { getJokeIfExists, getRandomJoke } from "../utils/joke";
import { getDayOfMonth } from "../utils/date";
import { spinAnimation } from "../components/animations/keyframes/spinAnimations";
import cinbyExpressionBlank from "../assets/cinby-v2-expression-blank.png";
import cinbyExpressionSmile from "../assets/cinby-v2-expression-smile.png";
import { FeatureHeading, SmallHeading } from "../components/Atoms";
import Theme from "../themes";
import { Appear } from "../components/animations/Appear";

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${Theme.tokens.colours.primaryBackground};
`;

const PositionContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const MainLayoutContainer = styled.div`
  display: flex;
  gap: 5rem;
  justify-content: center;
  align-items: center;
`;
const MascotContainer = styled.div``;

const JokeContainer = styled.div``;

const JokeText = styled.h1`
  font-size: 3rem;
  font-family: ${Theme.tokens.fonts.feature};
  color: ${Theme.tokens.colours.primaryText};
  margin-bottom: 1rem;
`;

const JokePunchline = styled.h2`
  font-size: 2rem;
  font-family: ${Theme.tokens.fonts.body};
  color: ${Theme.tokens.colours.buttonSecondaryBackground};
`;

type ViewState = {
  cinbyExpressionImage: StaticImageData;
  showJokeQuestion: boolean;
  showJokeAnswer: boolean;
};

type Joke = {
  jokeText: string;
  answer: string;
};

const Home = ({ joke }: { joke?: Joke }) => {
  const [viewState, setViewState] = useState<ViewState>({
    cinbyExpressionImage: cinbyExpressionBlank,
    showJokeQuestion: true,
    showJokeAnswer: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setViewState((vs) => ({
        ...vs,
        showJokeAnswer: true,
        cinbyExpressionImage: cinbyExpressionSmile,
      }));
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

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
      <Container>
        <PositionContainer>
          <MainLayoutContainer>
            <MascotContainer>
              <Image
                src={viewState.cinbyExpressionImage}
                alt=""
                width={370}
                height={672}
              />
            </MascotContainer>
            <JokeContainer>
              <JokeText>{joke.jokeText}</JokeText>
              <Appear show={viewState.showJokeAnswer} animation="flip-in">
                <JokePunchline>{joke.answer}</JokePunchline>
              </Appear>
            </JokeContainer>
          </MainLayoutContainer>
        </PositionContainer>
      </Container>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { jokeId } = query;

  const parsedJokeId = jokeId ? parseInt(jokeId as string, 10) : null;
  if (parsedJokeId) {
    const joke = getJokeIfExists(parsedJokeId);
    if (joke) {
      return {
        props: {
          joke,
        },
      };
    }
  }

  const joke = pipe(
    getDayOfMonth() - 1,
    getJokeIfExists,
    (j) => j || getRandomJoke()
  );

  return {
    props: {
      joke,
    },
  };
};

export default Home;
