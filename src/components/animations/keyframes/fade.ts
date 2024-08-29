import { keyframes } from "styled-components";

export const fadeInAnimation = keyframes`
  0% {opacity: 0;}
  100% {opacity: 1;}
`;

export const fadeInBottom = keyframes`
  0% {
    -webkit-transform: translateY(50px);
            transform: translateY(50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

export const fadeOutTop = keyframes`
  0% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateY(-50px);
            transform: translateY(-50px);
    opacity: 0;
  }
`;

export const fadeInDownAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, -2000px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

export const fadeInLeftAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

export const fadeOutUpAnimation = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(0, -200%, 0);
  }
`;

export const fadeInOutBottomToTop = keyframes`
  0% {
    transform: translateY(50px);
    opacity: 0;
  }
  30% {
    transform: translateY(0);
    opacity: 1;
  }
  70% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-50px);
    opacity: 0;
  }
`;

export const fadeInOutRight = keyframes`
  0% {
    transform: translateX(20px);
    opacity: 0;
  }
  30% {
    transform: translateX(0);
    opacity: 1;
  }
  70% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-10px);
    opacity: 0;
  }
`;
