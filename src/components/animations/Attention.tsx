import styled, {
  FlattenSimpleInterpolation,
  css,
  keyframes,
} from "styled-components";

type AttentionAnimation = "vibrate" | "shake";

const Animation_Vibrate = keyframes` {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}`;

const Animation_ShakeBottom = keyframes` {
  0%,
  100% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-transform-origin: 50% 100%;
            transform-origin: 50% 100%;
  }
  10% {
    -webkit-transform: rotate(2deg);
            transform: rotate(2deg);
  }
  20%,
  40%,
  60% {
    -webkit-transform: rotate(-4deg);
            transform: rotate(-4deg);
  }
  30%,
  50%,
  70% {
    -webkit-transform: rotate(4deg);
            transform: rotate(4deg);
  }
  80% {
    -webkit-transform: rotate(-2deg);
            transform: rotate(-2deg);
  }
  90% {
    -webkit-transform: rotate(2deg);
            transform: rotate(2deg);
  }
}`;

const ANIMATION_CSS: {
  [key in AttentionAnimation]: FlattenSimpleInterpolation;
} = {
  vibrate: css`
    animation: ${Animation_Vibrate} 0.3s linear infinite both;
  `,
  shake: css`
    animation: ${Animation_ShakeBottom} 3s
      cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite both;
  `,
};

const Container = styled.div<{ animation: FlattenSimpleInterpolation }>`
  ${({ animation }) => animation}
`;

type Props = {
  children: React.ReactNode;
  animate?: boolean;
  animation?: AttentionAnimation;
};

export const Attention = ({
  children,
  animate = true,
  animation = "vibrate",
}: Props) => {
  return animate ? (
    <Container animation={ANIMATION_CSS[animation]}>{children}</Container>
  ) : (
    <>{children}</>
  );
};
