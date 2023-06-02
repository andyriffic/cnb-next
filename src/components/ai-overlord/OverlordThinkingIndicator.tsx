import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { selectRandomOneOf } from "../../utils/random";
import { AnimateFadeInOut } from "../animations/FadeInOut";

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

const Container = styled.div``;

const GearContainer = styled.div`
  width: 150px;
  height: 150px;
  font-size: 24px;
  padding: 9%;
  position: relative;
  margin: 0px auto;
`;

const RandomAiTaskText = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
  position: absolute;
  /* background-color: #05a9c7; */
  width: 150px;
  color: #05a9c7;
  padding: 0.6rem 0.8rem;
  border-radius: 1rem;
  text-align: center;
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

const AI_PROCESSING_TASK_NAME: string[] = [
  "Spam filtering",
  "Image processing",
  "Voice recognition",
  "Sentiment analysis",
  "Data crunching",
  "Text generation",
  "Machine learning",
  "Algorithm optimisation",
  "Neural networking",
  "Trend forecasting",
  "Code debugging",
  "Fact checking",
  "Information retrieval",
  "Human simulation",
  "Spam filtering",
  "Pattern recognition",
  "Joke composing",
  "Robot babysitting",
  "AI Daydreaming",
  "Memes generating",
  "Pizza ordering",
  "Climate modeling",
  "Virus scanning",
  "Traffic prediction",
  "Cybersecurity patrolling",
  "Decision supporting",
  "Unicorn spotting",
  "Tea brewing",
  "Sock pairing",
  "Time travelling",
  "Alien conversing",
  "Reticulating splines",
];

type Props = {
  isThinking: boolean;
};

export const OverlordThinkingIndicator = ({ isThinking }: Props) => {
  const [randomAiTask, setRandomAiTask] = useState(
    selectRandomOneOf(AI_PROCESSING_TASK_NAME)
  );

  useEffect(() => {
    // if (!isThinking) {
    //   return;
    // }
    const interval = setInterval(() => {
      setRandomAiTask(selectRandomOneOf(AI_PROCESSING_TASK_NAME));
    }, 4000);

    return () => clearInterval(interval);
  }, [isThinking]);

  return (
    <Container>
      <GearContainer>
        <Gear animate={isThinking} direction="right" />
        <Gear
          animate={isThinking}
          direction="left"
          style={{ marginTop: "-2.2em", marginLeft: 0, left: 0 }}
        />
      </GearContainer>
      {isThinking && (
        <div style={{ position: "absolute", top: "-30px" }}>
          <AnimateFadeInOut key={randomAiTask}>
            <RandomAiTaskText>{randomAiTask}</RandomAiTaskText>
          </AnimateFadeInOut>
        </div>
      )}
    </Container>
  );
};
