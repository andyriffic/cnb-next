import { ReactNode, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { slideInBlurredTop } from "./animations/keyframes/slideInBlurredTop";
import { slideOutBlurredBottom } from "./animations/keyframes/slideOutBlurredBottom";

const ANIMATION_DURATION_MS = 1100;

const Container = styled.div`
  position: absolute;
  text-align: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  /* background-color: black; */
  pointer-events: none;
  overflow: hidden;
  /* z-index: 100; */
`;

const AnimatedContent = styled.div<{ show: boolean }>`
  /* position: absolute;
  top: 50%;
  left: 50%; */
  margin-top: 15vh;
  transform: translateX(-50%);
  ${({ show }) =>
    css`
      animation: ${show ? slideInBlurredTop : slideOutBlurredBottom}
        ${ANIMATION_DURATION_MS}ms both;
    `}
`;

type Props = {
  children: ReactNode;
  showForMilliseconds?: number;
  onShowEffect?: () => void;
  onComplete?: () => void;
};

export function SplashContent({
  children,
  showForMilliseconds = 2000,
  onShowEffect,
  onComplete,
}: Props): JSX.Element {
  const [show, setShow] = useState(true);

  useEffect(() => {
    onShowEffect && onShowEffect();
  }, [onShowEffect]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
      onComplete && onComplete();
    }, showForMilliseconds + ANIMATION_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [onComplete, showForMilliseconds]);

  return (
    <Container>
      <AnimatedContent show={show}>{children}</AnimatedContent>
    </Container>
  );
}
