import React from "react";
import styled, { css } from "styled-components";
import { Direction, GasGame } from "../../../services/migrated/gas-out/types";

const Arrow = styled.img<{ direction: Direction }>`
  width: 70px;
  transition: transform 300ms ease-in-out;
  ${({ direction }) =>
    css`
      transform: rotate(${direction === "right" ? "180" : "0"}deg);
    `}
`;

type Props = {
  game: GasGame;
};

export function GameDirectionIndicator({ game }: Props): JSX.Element {
  return (
    <Arrow
      src="/images/gas-out/arrow-left-1"
      alt=""
      direction={game.direction}
    />
  );
}
