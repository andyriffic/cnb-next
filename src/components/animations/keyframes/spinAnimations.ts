import { keyframes } from "styled-components";

export const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-1080deg); }
`;

export const spinAwayAnimationUp = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(0, -1000px) rotate(-1080deg); }
`;
