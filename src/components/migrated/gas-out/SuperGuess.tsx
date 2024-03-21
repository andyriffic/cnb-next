import styled, { keyframes } from "styled-components";
import { useEffect } from "react";
import { Appear } from "../../animations/Appear";
import { useSound } from "../../hooks/useSound";

const TextClipKeyframe = keyframes`
  to {
    background-position: 200% center;
  }
`;

// https://codepen.io/alvarotrigo/pen/PoKMyNO
export const AnimatedText = styled.div`
  text-transform: uppercase;
  background-image: linear-gradient(
    -225deg,
    #231557 0%,
    #44107a 29%,
    #ff1361 67%,
    #fff800 100%
  );
  background-size: auto auto;
  background-clip: border-box;
  background-size: 200% auto;
  color: #fff;
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${TextClipKeyframe} 2s linear infinite;
  display: inline-block;
  font-size: 2rem;
  font-weight: bold;
`;

const Container = styled.div``;

export function SuperGuess(): JSX.Element {
  const { play } = useSound();

  useEffect(() => {
    play("gas-super-guess");
  }, [play]);

  return (
    <Appear animation="roll-in-right">
      <Container>
        <AnimatedText>SUPER GUESS!!</AnimatedText>
      </Container>
    </Appear>
  );
}
