import styled, { keyframes } from "styled-components";
import Image from "next/image";
import peekingBear from "../assets/finx-mascot-peeking-xmas.png";

const PeekAnimation = keyframes`
  0% {
    transform: translate3D(0, 0, 0);
  }
  40% {
    transform: translate3D(0, -60%, 0);
  }
  70% {
    transform: translate3D(0, -60%, 0);
  }
  80% {
    transform: translate3D(0, 0, 0);
  }
  100% {
    transform: translate3D(0, 0, 0);
  }
`;

const PositionedContainer = styled.div`
  position: fixed;
  bottom: -200px;
  left: 50%;
  /* transform-origin: 0% 50%; */
  animation: ${PeekAnimation} 10s ease-in-out 3s infinite;
`;

export const PeekaBear = () => {
  return (
    <PositionedContainer>
      <Image src={peekingBear} alt="" />
    </PositionedContainer>
  );
};
