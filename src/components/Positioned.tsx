import styled, { css } from "styled-components";

const Container = styled.div<{ absolute: AbsolutePosition }>`
  position: absolute;
  ${({ absolute }) =>
    absolute.topPercent &&
    css`
      top: ${absolute.topPercent}vh;
    `}
  ${({ absolute }) =>
    absolute.bottomPercent &&
    css`
      bottom: ${absolute.bottomPercent}vh;
    `}
  ${({ absolute }) =>
    absolute.leftPercent &&
    css`
      left: ${absolute.leftPercent}vw;
    `}
    ${({ absolute }) =>
    absolute.rightPercent &&
    css`
      right: ${absolute.rightPercent}vw;
    `}
`;

type AbsolutePosition = {
  topPercent?: number;
  leftPercent?: number;
  bottomPercent?: number;
  rightPercent?: number;
};

type Props = {
  children: React.ReactNode;
  absolute?: AbsolutePosition;
};

export function Positioned({ children, absolute = {} }: Props): JSX.Element {
  return <Container absolute={absolute}>{children}</Container>;
}
