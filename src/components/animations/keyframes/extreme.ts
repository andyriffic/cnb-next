import { keyframes } from "styled-components";

export const explodeAnimation = keyframes`
 0% { opacity: 1; }
 100% { opacity: 0; transform: scale(3) rotate(10deg); }
`;

export const shakeExtremeAnimation = keyframes`
  0% { transform: translate(2px, 2px) rotate(0deg); }
  10% { transform: translate(-2px, -4px) rotate(-3deg); }
  20% { transform: translate(-6px, 0px) rotate(3deg); }
  30% { transform: translate(6px, 4px) rotate(0deg); }
  40% { transform: translate(2px, -2px) rotate(3deg); }
  50% { transform: translate(-2px, 4px) rotate(-3deg); }
  60% { transform: translate(-6px, 2px) rotate(0deg); }
  70% { transform: translate(6px, 2px) rotate(-3deg); }
  80% { transform: translate(-2px, -2px) rotate(3deg); }
  90% { transform: translate(2px, 4px) rotate(1deg); }
  100% { transform: translate(2px, 2px) rotate(0deg); }
`;

export const shakeAnimationLeft = keyframes`
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
`;
