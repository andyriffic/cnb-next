import styled, { keyframes, css } from "styled-components";

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

const Container = styled.div<{ delayMilliseconds: number }>`
  ${({ delayMilliseconds }) =>
    css`
      animation: ${animation} 500ms ease-in ${delayMilliseconds}ms 1 both;
    `}
`;

type Props = {
  children: React.ReactNode;
  delayMilliseconds?: number;
};

export const AnimateFadeInLeft = ({
  children,
  delayMilliseconds = 0,
}: Props): JSX.Element => {
  return (
    <Container delayMilliseconds={delayMilliseconds}>{children}</Container>
  );
};
