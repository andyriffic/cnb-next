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
};

export function SplashContent({
  children,
  showForMilliseconds = 2000,
}: Props): JSX.Element {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(
      () => setShow(false),
      showForMilliseconds + ANIMATION_DURATION_MS
    );
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Container>
      <AnimatedContent show={show}>{children}</AnimatedContent>
    </Container>
  );
}
