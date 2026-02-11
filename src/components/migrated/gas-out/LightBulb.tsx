import React from "react";
import styled from "styled-components";
import { GasGame } from "../../../services/migrated/gas-out/types";
import { PlayerListPlayer } from "./PlayerListPlayer";

const Bulb = styled.div<{ glow: boolean }>`
  font-size: 8rem;
  filter: ${({ glow }) => (glow ? "unset" : "invert(80%)")};
`;

type Props = {
  state: "on" | "off";
};

export function LightBulb({ state }: Props): JSX.Element {
  return <Bulb glow={state === "on"}>💡</Bulb>;
}
