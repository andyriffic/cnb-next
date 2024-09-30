import styled, {
  FlattenSimpleInterpolation,
  css,
  keyframes,
} from "styled-components";

type AttentionAnimation = "vibrate" | "slow-vibrate" | "shake" | "pulse";

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

export const Animation_ShakeBottom = keyframes` {
  0%,
  100% {
            transform: rotate(0deg);
            transform-origin: 50% 100%;
  }
  10% {
            transform: rotate(1deg);
  }
  20%,
  40%,
  60% {
            transform: rotate(-2deg);
  }
  30%,
  50%,
  70% {
            transform: rotate(2deg);
  }
  80% {
            transform: rotate(-1deg);
  }
  90% {
            transform: rotate(1deg);
  }
}`;

export const Animation_Pulse = keyframes` {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}`;

export const Animation_Pulse_Plus = keyframes` {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(2) rotate(360deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}`;

const ANIMATION_CSS: {
  [key in AttentionAnimation]: FlattenSimpleInterpolation;
} = {
  vibrate: css`
    animation: ${Animation_Vibrate} 0.3s linear infinite both;
  `,
  "slow-vibrate": css`
    animation: ${Animation_Vibrate} 1.5s linear infinite both;
  `,
  shake: css`
    animation: ${Animation_ShakeBottom} 2.5s
      cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite both;
  `,
  pulse: css`
    animation: ${Animation_Pulse} 3s ease-in-out infinite both;
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
