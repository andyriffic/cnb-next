import styled, { keyframes } from "styled-components";

export const animation = keyframes`
  from {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const Container = styled.div`
  animation: ${animation} 500ms ease-in both;
`;

type Props = {
  children: React.ReactNode;
};

export const AnimateFadeIn = ({ children }: Props): JSX.Element => {
  return <Container>{children}</Container>;
};
