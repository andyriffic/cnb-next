import styled, {
  css,
  FlattenSimpleInterpolation,
  keyframes,
} from "styled-components";
import { textFocusIn } from "./keyframes/textFocusIn";

type AppearAnimation =
  | "roll-in-left"
  | "roll-in-right"
  | "flip-in"
  | "text-focus-in";

const Animation_RollInBlurredLeft = keyframes` {
  0% {
    transform: translateX(-20vw) rotate(-720deg);
    filter: blur(50px);
    opacity: 0;
  }
  100% {
    transform: translateX(0) rotate(0deg);
    filter: blur(0);
    opacity: 1;
  }
}`;

const Animation_RollInBlurredRight = keyframes` {
  0% {
    transform: translateX(20vw) rotate(-720deg);
    filter: blur(50px);
    opacity: 0;
  }
  100% {
    transform: translateX(0) rotate(0deg);
    filter: blur(0);
    opacity: 1;
  }
}`;

const Animation_FlipIn = keyframes`
  0% {
    transform: rotateY(-80deg);
    opacity: 0;
  }
  100% {
    transform: rotateY(0);
    opacity: 1;
  }
`;

const ANIMATION_CSS: {
  [key in AppearAnimation]: FlattenSimpleInterpolation;
} = {
  "roll-in-left": css`
    animation: ${Animation_RollInBlurredLeft} 0.65s
      cubic-bezier(0.23, 1, 0.32, 1) both;
  `,
  "roll-in-right": css`
    animation: ${Animation_RollInBlurredRight} 0.65s
      cubic-bezier(0.23, 1, 0.32, 1) both;
  `,
  "flip-in": css`
    animation: ${Animation_FlipIn} 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)
      both;
  `,
  "text-focus-in": css`
    animation: ${textFocusIn} 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
  `,
};

const Container = styled.div<{ animation?: FlattenSimpleInterpolation }>`
  ${({ animation }) => animation}
`;

type Props = {
  children: React.ReactNode;
  show?: boolean;
  animation?: AppearAnimation;
};

export const Appear = ({
  children,
  show = true,
  animation = "flip-in",
}: Props): JSX.Element | null => {
  return show ? (
    <Container animation={animation && ANIMATION_CSS[animation]}>
      {children}
    </Container>
  ) : null;
};
