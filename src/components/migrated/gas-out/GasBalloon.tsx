import Image from "next/image";
import styled, { css } from "styled-components";
import tinycolor from "tinycolor2";
import { GasCloud } from "../../../services/migrated/gas-out/types";
import {
  explodeAnimation,
  shakeExtremeAnimation,
} from "../../animations/keyframes/extreme";
import sixiaoFaceImage from "./sixiao-face.png";

function getCloudAnimationSpeedMilliSeconds(intensity: number): number {
  return Math.max(6000 - intensity * 500, 100);
}

const Container = styled.div<{ size: number; exploded: boolean }>`
  pointer-events: none;
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  ${({ size, exploded }) =>
    exploded
      ? css`
          animation: ${explodeAnimation} 100ms ease-in 0s 1 forwards;
        `
      : css`
          animation: ${shakeExtremeAnimation}
            ${getCloudAnimationSpeedMilliSeconds(size)}ms ease-in-out 0s
            infinite;
        `};
`;

const Ballon = styled.div<{ size: number }>`
  display: inline-block;
  width: ${({ size }) => size * 10 + 50}px;
  height: ${({ size }) => size * 10 + 50}px;
  background: ${({ size }) =>
    tinycolor("#FBA727")
      .saturate(size * 10)
      .toString()};
  border-radius: 80%;
  position: relative;
  transition: all 180ms ease-in;
  box-shadow: inset -10px -10px 0 rgba(0, 0, 0, 0.07);
  margin: 20px 30px;

  &::before {
    content: "▲";
    font-size: 20px;
    color: ${({ size }) =>
      tinycolor("#d28b20")
        .saturate(size * 10)
        .toString()};
    display: block;
    text-align: center;
    width: 100%;
    position: absolute;
    bottom: -12px;
    z-index: -100;
  }
`;

const Carol = styled(Image)<{ size: number }>`
  display: inline-block;
  width: ${({ size }) => size * 10 + 80}px;
  height: ${({ size }) => size * 10 + 80}px;
  transition: all 180ms ease-in;
`;

type Props = {
  gasCloud: GasCloud;
};

export function GasBallon({ gasCloud }: Props): JSX.Element {
  const visibleSize = gasCloud.exploded ? 10 : gasCloud.pressed;
  return (
    <Container size={visibleSize} exploded={gasCloud.exploded}>
      <Ballon size={visibleSize} />
      {/* <span
        style={{
          fontSize: `${visibleSize * 0.6 + 5}rem`,
          transition: "all 500ms linear",
        }}
      >
        🤰
      </span> */}
      {/* <Carol size={visibleSize} src={sixiaoFaceImage} alt="Sixiao's face" /> */}
    </Container>
  );
}
