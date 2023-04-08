import styled, { css, keyframes } from "styled-components";

const gearRotateRightKeyframes = keyframes`
  0% { 
    transform: rotate(0deg); 
  }
  100% { 
    transform: rotate(-180deg); 
  }
`;
const gearRotateLeftKeyframes = keyframes`
 0% { 
   -webkit-transform: rotate(30deg); 
  }
  100% { 
    -webkit-transform: rotate(210deg);
  }
`;

const Container = styled.div`
  width: 150px;
  height: 150px;
  font-size: 24px;
  padding: 9%;
  position: relative;
  margin: 0px auto;
`;

const Gear = styled.div<{ animate: boolean; direction: "left" | "right" }>`
  width: 2em;
  height: 2em;
  top: 50%;
  left: 50%;
  margin-top: -1em;
  margin-left: -1em;
  background: #05a9c7;
  position: absolute;
  border-radius: 1em;
  ${({ animate, direction }) =>
    animate &&
    css`
      animation: ${direction === "right"
          ? gearRotateRightKeyframes
          : gearRotateLeftKeyframes}
        1s infinite linear;
    `}

  ::before {
    width: 2.8em;
    height: 2.8em;
    background: linear-gradient(
        0deg,
        transparent 39%,
        #05a9c7 39%,
        #05a9c7 61%,
        transparent 61%
      ),
      linear-gradient(
        60deg,
        transparent 42%,
        #05a9c7 42%,
        #05a9c7 58%,
        transparent 58%
      ),
      linear-gradient(
        120deg,
        transparent 42%,
        #05a9c7 42%,
        #05a9c7 58%,
        transparent 58%
      );
    position: absolute;
    content: "";
    top: -0.4em;
    left: -0.4em;
    border-radius: 1.4em;
  }

  ::after {
    width: 1em;
    height: 1em;
    background: #2b2b2b;
    position: absolute;
    content: "";
    top: 0.5em;
    left: 0.5em;
    border-radius: 0.5em;
  }
`;

type Props = {
  isThinking: boolean;
};

export const OverlordThinkingIndicator = ({ isThinking }: Props) => {
  return (
    <Container>
      <Gear animate={isThinking} direction="right" />
      <Gear
        animate={isThinking}
        direction="left"
        style={{ marginTop: "-2.2em", marginLeft: 0, left: 0 }}
      />
    </Container>
  );
};
