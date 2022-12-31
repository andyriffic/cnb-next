import styled, { css } from "styled-components";

const AbsoluteContainer = styled.div<{ absolute: AbsolutePosition }>`
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

const HorizontalContainer = styled.div<{ topPercent: number }>`
  position: absolute;
  top: ${({ topPercent }) => topPercent}vh;
  left: 50%;
  transform: translateX(-50%);
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
  horizontalAlign?: { align: "center"; topPercent: number };
};

export function Positioned({
  children,
  absolute,
  horizontalAlign,
}: Props): JSX.Element {
  if (absolute) {
    return (
      <AbsoluteContainer absolute={absolute}>{children}</AbsoluteContainer>
    );
  }

  if (horizontalAlign) {
    return (
      <HorizontalContainer topPercent={horizontalAlign.topPercent}>
        {children}
      </HorizontalContainer>
    );
  }

  return <>Position not set</>;
}
