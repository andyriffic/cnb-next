import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { GasCloud } from "../../../services/migrated/gas-out/types";
import THEME from "../../../themes";
import { generateRandomInt, selectRandomOneOf } from "../../../utils/random";
import { Appear } from "../../animations/Appear";
import {
  explodeAnimation,
  shakeExtremeAnimation,
} from "../../animations/keyframes/extreme";
import michelleFaceImage from "./michelleface.png";

function getCloudAnimationSpeedMilliSeconds(intensity: number): number {
  return Math.max(8000 - intensity * 500, 100);
}

const ExtraFeatureTitles = [
  "Add support for emotional repayments",
  "Home loan now available for castles",
  'Customer requests repayment frequency: "vibes"',
  "Loan calculator should predict the housing market",
  "Fix issue where moon phase affects approvals",
  "Support mortgages on the Moon (future-proofing)",
  "Make spinner spin faster to feel faster",
  "Add blockchain (reason TBD)",
  "Make the button more button-y",
  "Bug only occurs on Wednesdays, please investigate",
  "Fix bug where customer somehow has negative children",
  "Support Home loans for imaginary properties",
  "Replace backend data with spreadsheet",
  "Fix quantum race condition",
  "Add support for Internet Explorer",
  "Please fix urgent bug without changing any code",
  "Investigate why the dev environment has become self-aware",
  "Production is haunted again, please investigate",
  "Broker uploaded a photo of a dog instead of payslips, please fix",
  "Add dark mode to PDF statements",
  "Support left-handed users (design request)",
  'Make repayment calculator "more fun"',
  "Add confetti when loan is approved",
  "Broker requests Excel export",
  "Add AI explanation of interest rates",
  "Make loan calculator work offline",
  'Add "Undo" for submitted applications',
  "Support applications which started on a Smart TV",
  "Can this be configurable in CMS?",
  "Marketing wants animations",
  "Add seasonal home loan themes",
];
// const SpeechText = [
//   "I just applied for a home loan because I want to upgrade to a banana split-level house",
//   "I talked to my mortgage broker and a-peeled for a good rate",
//   "I don't like computers because I'm afraid I'll get byte-n",
//   "我正在練習中文: Ni hao-ma-nana 👋",
//   "I'm normally late to meetings because I keep slipping on the keyboard",
//   "I would like to become a DL to make sure everything runs smoothie",
//   "My favorite holiday is Peel-o-ween",
//   "I don't wear shoes, I prefer slippers",
// ];

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

const RemainingPointsContainer = styled.div<{
  size: number;
  exploded: boolean;
}>`
  // position: absolute;
  text-align: center;
  pointer-events: none;
  margin-top: 40px;
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

const RemainingPointsTitle = styled.div`
  font-size: 0.8rem;
  text-transform: uppercase;
`;

const RemainingPointsValue = styled.div`
  font-family: ${THEME.tokens.fonts.numbers};
  font-size: 2rem;
}`;

const TextContainer = styled.div`
  min-width: 300px;
`;

const FaceImage = styled(Image)<{ size: number }>`
  display: inline-block;
  width: ${({ size }) => size * 10 + 80}px;
  height: ${({ size }) => size * 10 + 80}px;
  transition: all 180ms ease-in;
`;

const JiraCardContainer = styled.div`
  // Taken from: https://codepen.io/josfabre/pen/EBMWwW
  position: relative;
  display: inline-block;
  margin: 20px;
  text-align: left;
  line-height: 1;
  // letter-spacing: -0.04em;
  background-color: white;
  color: black;
  padding: 0.3rem;
  box-shadow:
    0 -4px white,
    0 -8px black,
    4px 0 white,
    4px -4px black,
    8px 0 black,
    0 4px white,
    0 8px black,
    -4px 0 white,
    -4px 4px black,
    -8px 0 black,
    -4px -4px black,
    4px 4px black;

  box-sizing: border-box;
  width: 200px;
`;

const JiraCardTitle = styled.div`
  font-family: ${THEME.tokens.fonts.numbers};
  font-weight: bold;
  font-size: 1rem;
`;
const JiraCardText = styled.div``;

type Props = {
  gasCloud: GasCloud;
};

function getRandomSpeechText() {
  return selectRandomOneOf(ExtraFeatureTitles);
}

const SPEECH_INTERVAL_MILLISECONDS = 10000;

export function ScopeCreepBalloon({ gasCloud }: Props): JSX.Element {
  const [jiraCardDescription, setJiraCardDescription] = useState("");
  const speechManager = useRef(createSpeechManager(ExtraFeatureTitles));
  const visibleSize = gasCloud.exploded ? 10 : gasCloud.pressed;

  useEffect(() => {
    if (gasCloud.exploded) {
      return;
    }

    const interval = setInterval(() => {
      setJiraCardDescription(speechManager.current.next());
    }, SPEECH_INTERVAL_MILLISECONDS);
    return () => clearInterval(interval);
  }, [gasCloud.exploded, jiraCardDescription]);

  return (
    <Container>
      <RemainingPointsContainer size={visibleSize} exploded={gasCloud.exploded}>
        <RemainingPointsTitle>Sprint Points:</RemainingPointsTitle>
        <RemainingPointsValue>{visibleSize}</RemainingPointsValue>
      </RemainingPointsContainer>
      <TextContainer>
        <Appear
          show={!!jiraCardDescription && !gasCloud.exploded}
          animation="text-focus-in"
        >
          <JiraCardContainer>
            <JiraCardTitle>SEC-{generateRandomInt(100, 999)}</JiraCardTitle>
            <JiraCardText>{jiraCardDescription}</JiraCardText>
          </JiraCardContainer>
        </Appear>
      </TextContainer>
    </Container>
  );
}
