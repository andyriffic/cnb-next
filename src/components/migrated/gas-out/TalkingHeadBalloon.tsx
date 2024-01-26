import Image from "next/image";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { GasCloud } from "../../../services/migrated/gas-out/types";
import THEME from "../../../themes/types";
import { selectRandomOneOf } from "../../../utils/random";
import { Appear } from "../../animations/Appear";
import {
  explodeAnimation,
  shakeExtremeAnimation,
} from "../../animations/keyframes/extreme";
import carolFaceImage from "./carol-face.png";

function getCloudAnimationSpeedMilliSeconds(intensity: number): number {
  return Math.max(8000 - intensity * 500, 100);
}

const SpeechText = [
  "Is your system green?",
  "Please make sure you drink plenty of water",
  "Please don't pop me 😥",
  "Have a Marvel-ous day",
];

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
  min-width: 250px;
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
  font-size: 1.4rem;
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

export function TalkingHeadBalloon({ gasCloud }: Props): JSX.Element {
  const [speechText, setSpeechText] = useState(selectRandomOneOf(SpeechText));
  const visibleSize = gasCloud.exploded ? 10 : gasCloud.pressed;

  useEffect(() => {
    if (gasCloud.exploded) {
      return;
    }

    const interval = setInterval(() => {
      if (speechText) {
        setSpeechText("");
      } else {
        setSpeechText(getRandomSpeechText());
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [gasCloud.exploded, speechText]);

  return (
    <Container>
      <ImageContainer size={visibleSize} exploded={gasCloud.exploded}>
        <FaceImage
          size={visibleSize}
          src={carolFaceImage}
          alt="Wrapped christmas gift box"
        />
      </ImageContainer>
      <TextContainer>
        <Appear show={!!speechText} animation="text-focus-in">
          <SpeechBubble>{speechText}</SpeechBubble>
        </Appear>
      </TextContainer>
    </Container>
  );
}
