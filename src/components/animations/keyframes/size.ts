import { keyframes } from "styled-components";

export const shrinkAnimation = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(0.8); }
`;

export const growAnimation = keyframes`
  0% { transform: scale(0); }
  100% { transform: scale(1); }
`;
