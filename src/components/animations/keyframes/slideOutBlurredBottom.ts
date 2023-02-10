import { keyframes } from "styled-components";

export const slideOutBlurredBottom = keyframes`
  0% {
    transform: translateY(0) scaleY(1) scaleX(1);
    transform-origin: 50% 50%;
    filter: blur(0);
    opacity: 1;
  }
  100% {
    transform: translateY(1000px) scaleY(2) scaleX(0.2);
    transform-origin: 50% 100%;
    filter: blur(40px);
    opacity: 0;
  }
`;
