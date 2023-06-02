import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { fadeInBottom, fadeOutTop } from "./keyframes/fade";

const Container = styled.div<{ isExiting: boolean }>`
  ${({ isExiting }) =>
    css`
      animation: ${isExiting ? fadeOutTop : fadeInBottom} 300ms ease-in 0ms 1
        both;
    `}
`;

type Props = {
  children: React.ReactNode;
};

export const AnimateFadeInOut = ({ children }: Props): JSX.Element => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsExiting(true), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return <Container isExiting={isExiting}>{children}</Container>;
};
