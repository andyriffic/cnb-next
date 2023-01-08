import styled, { keyframes } from "styled-components";

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

const Container = styled.div`
  animation: ${Animation_Vibrate} 0.3s linear infinite both;
`;

type Props = {
  children: React.ReactNode;
  animate?: boolean;
};

export const Attention = ({ children, animate = true }: Props) => {
  return animate ? <Container>{children}</Container> : <>{children}</>;
};
