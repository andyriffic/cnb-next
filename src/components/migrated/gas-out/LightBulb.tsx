import React from "react";
import styled from "styled-components";
import { GasGame } from "../../../services/migrated/gas-out/types";
import { PlayerListPlayer } from "./PlayerListPlayer";

const Bulb = styled.div<{ glow: boolean }>`
  font-size: 8rem;
  filter: ${({ glow }) => (glow ? "unset" : "invert(80%)")};
`;

//box-shadow: 100px 100px 80px 100px #ffffff;

const Text = styled.div`
  text-align: center;
  background: black;
  color: white;
  padding: 0.5rem 1rem;
`;

type Props = {
  state: "on" | "off";
};

export function LightBulb({ state }: Props): JSX.Element {
  return (
    <div>
      <Bulb glow={state === "on"}>💡</Bulb>
      {state === "off" && <Text>Dark mode</Text>}
    </div>
  );
}
