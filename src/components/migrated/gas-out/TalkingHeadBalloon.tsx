import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { GasCloud } from "../../../services/migrated/gas-out/types";
import THEME from "../../../themes/types";
import { selectRandomOneOf } from "../../../utils/random";
import { Appear } from "../../animations/Appear";
import {
  explodeAnimation,
  shakeExtremeAnimation,
} from "../../animations/keyframes/extreme";
import dragon from "./dragon.png";

function getCloudAnimationSpeedMilliSeconds(intensity: number): number {
  return Math.max(8000 - intensity * 500, 100);
}

const SpeechText = [
  "May the dragon bring you prosperity and energy in the new year",
  "祝龍年好運",
  "May good luck fall on you for that promotion this year",
  "日进斗金",
  "Hoping your year is one of abundance and health",
  "說英語的人不會知道這是什麼意思",
  "May your work go smoothly and successfully this year",
  "金玉满堂",
];

const createSpeechManager = (textOptions: string[]) => {
  let index = -1;
  let showText = false;
  return {
    next: (): string => {
      showText = !showText;

      if (showText) {
        index++;
        if (index >= textOptions.length) {
          index = 0;
        }
        return textOptions[index] || "";
      } else {
        return "";
      }
    },
  };
};

const Container = styled.div`
  // position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageContainer = styled.div<{ size: number; exploded: boolean }>`
  // position: absolute;
  pointer-events: none;
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  transition: all 180ms ease-in;
  ${({ size, exploded }) =>
    exploded
      ? css`
          animation: ${explodeAnimation} 100ms ease-in 0s 1 forwards;
        `
      : css`
          animation: ${shakeExtremeAnimation}
            ${getCloudAnimationSpeedMilliSeconds(size)}ms ease-in-out 0s
            infinite;
        `};
`;

const TextContainer = styled.div`
  min-width: 300px;
`;

const FaceImage = styled(Image)<{ size: number }>`
  display: inline-block;
  width: ${({ size }) => size * 10 + 80}px;
  height: ${({ size }) => size * 10 + 80}px;
  transition: all 180ms ease-in;
`;

const SpeechBubble = styled.div`
  // Taken from: https://codepen.io/josfabre/pen/EBMWwW
  position: relative;
  display: inline-block;
  margin: 20px;
  text-align: center;
  font-family: ${THEME.fonts.feature};
  font-size: 1.5rem;
  line-height: 1;
  // letter-spacing: -0.04em;
  background-color: white;
  color: black;
  padding: 0.3rem;
  box-shadow: 0 -4px white, 0 -8px black, 4px 0 white, 4px -4px black,
    8px 0 black, 0 4px white, 0 8px black, -4px 0 white, -4px 4px black,
    -8px 0 black, -4px -4px black, 4px 4px black;

  box-sizing: border-box;
  width: 200px;

  &::after {
    content: "";
    display: block;
    position: absolute;
    box-sizing: border-box;

    /*Left facing thingy for now*/
    height: 4px;
    width: 4px;
    top: 20px;
    left: -8px;
    background: white;
    box-shadow: -4px -4px white, -4px 0 white, -8px 0 white, 0 -8px white,
      -4px 4px black, -8px 4px black, -12px 4px black, -16px 4px black,
      -12px 0 black, -8px -4px black, -4px -8px black, 0 -4px white;
  }
`;

type Props = {
  gasCloud: GasCloud;
};

function getRandomSpeechText() {
  return selectRandomOneOf(SpeechText);
}

const SPEECH_INTERVAL_MILLISECONDS = 8000;

export function TalkingHeadBalloon({ gasCloud }: Props): JSX.Element {
  // const [speechText, setSpeechText] = useState("");
  // const speechManager = useRef(createSpeechManager(SpeechText));
  const visibleSize = gasCloud.exploded ? 10 : gasCloud.pressed;

  // useEffect(() => {
  //   if (gasCloud.exploded) {
  //     return;
  //   }

  //   const interval = setInterval(() => {
  //     setSpeechText(speechManager.current.next());
  //   }, SPEECH_INTERVAL_MILLISECONDS);
  //   return () => clearInterval(interval);
  // }, [gasCloud.exploded, speechText]);

  return (
    <Container>
      <ImageContainer size={visibleSize} exploded={gasCloud.exploded}>
        <FaceImage src={dragon} alt="Dragon" size={visibleSize} />
      </ImageContainer>
      {/* <TextContainer>
        <Appear
          show={!!speechText && !gasCloud.exploded}
          animation="text-focus-in"
        >
          <SpeechBubble>{speechText}</SpeechBubble>
        </Appear>
      </TextContainer> */}
    </Container>
  );
}
