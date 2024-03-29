import styled, { keyframes } from "styled-components";

const ArrowAnimation = keyframes`
    0% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
    50% {
        opacity: 1;
        transform: translate3d(0, 2px, 0);
    }
    100% {
        opacity: 1;
        transform: translate3d(0, 0px, 0);
    }
  `;

const ArrowGroup = styled.div<{ rotationDegrees: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: rotate(${({ rotationDegrees }) => rotationDegrees}deg);
`;

const ArrowItem = styled.div<{ delayMs: number }>`
  width: 0.5vw;
  height: 0.5vw;
  /* border-bottom: 2px solid white;
  border-right: 2px solid white;
  transform: rotate(45deg); */
  margin: -10px;
  animation: ${ArrowAnimation} 1s ${({ delayMs }) => delayMs}ms infinite;
`;

const getRotationDegrees = (direction: ArrowDirection): number => {
  switch (direction) {
    case "up":
      return 180;
    case "down":
      return 0;
    case "left":
      return 90;
    case "right":
      return 270;
  }
};

type ArrowDirection = "up" | "down" | "left" | "right";

type Props = {
  direction?: ArrowDirection;
  delayMs?: number;
};

export function Arrow({ direction = "down", delayMs = 0 }: Props) {
  return (
    <ArrowGroup rotationDegrees={getRotationDegrees(direction)}>
      <ArrowItem delayMs={delayMs}>👇🏻</ArrowItem>
    </ArrowGroup>
  );
}
