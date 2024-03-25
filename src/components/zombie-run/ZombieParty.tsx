import { useEffect } from "react";
import styled from "styled-components";
import THEME from "../../themes/types";
import { Heading } from "../Atoms";
import { Appear } from "../animations/Appear";
import { useSound } from "../hooks/useSound";

const Container = styled.div`
  position: fixed;
  top: 15%;
  width: 100vw;
  text-align: center;
`;

const Text = styled(Heading)`
  font-size: 8rem;
  text-transform: uppercase;
  font-weight: bold;
  font-family: ${THEME.fonts.feature};
  color: #69b362;
  -webkit-text-stroke-width: 4px;
  -webkit-text-stroke-color: darkgreen;
  /* letter-spacing: 0.5rem; */
`;

type Props = {};

export const ZombieParty = ({}: Props) => {
  const { loop } = useSound();

  useEffect(() => {
    const music = loop("zombie-run-party");
    music.play();

    return () => {
      music.stop();
    };
  }, [loop]);

  return (
    <Container>
      <Appear animation="flip-in">
        <Text>🧟‍♂️ ZOMBIE PARTY 🧟‍♀️</Text>
      </Appear>
    </Container>
  );
};
