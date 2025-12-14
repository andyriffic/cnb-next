import { useEffect, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import tinycolor from "tinycolor2";
import { FONT_FAMILY } from "../../colors";
import { spinAnimation } from "../animations/keyframes/spinAnimations";
import THEME from "../../themes";
import { Appear } from "../animations/Appear";
import { useSound } from "../hooks/useSound";
import { PacManGhost } from "./PacManGhost";
import { PacManPlayer } from "./types";
import { PacManGhostWithSantaHat } from "./PacManGhostWithSantaHat";

const Container = styled.div<{ goingToJail: boolean }>`
  position: relative;
  ${({ goingToJail }) =>
    goingToJail &&
    css`
      animation: ${spinAnimation} 1000ms linear;
    `}
`;

const PlayerName = styled.div`
  background-color: white;
  text-transform: uppercase;
  color: red;
  padding: 3px;
  border-radius: 5px;
  font-size: 0.6rem;
  text-align: center;
  position: absolute;
  top: -10px;
  border: 1px solid;
  white-space: nowrap;
`;

const MovesRemaining = styled.div`
  position: absolute;
  bottom: -15%;
  left: 15%;
  padding: 0.1rem;
  background: black;
  border-radius: 50%;
  border: 2px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
  font-family: ${FONT_FAMILY.numeric};
  font-size: 1rem;
`;

const PowerPill = styled.div`
  position: absolute;
  bottom: -15%;
  right: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const SafeIndicator = styled.div`
  position: absolute;
  bottom: 0;
  right: 50%;
  transform: translateX(50%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  background: ${THEME.tokens.colours.buttonPrimaryBackground};
  padding: 0.2rem;
  color: ${THEME.tokens.colours.buttonPrimaryText};
  border-radius: 0.5rem;
  border: 1px solid white;
`;

type Props = {
  pacPlayer: PacManPlayer;
};

export function BoardPlayer({ pacPlayer }: Props): JSX.Element {
  const startingJailMoves = useRef(pacPlayer.jailTurnsCount);
  const initialPowerPill = useRef(pacPlayer.powerPill);
  const { play } = useSound();

  const usedPowerPill = useMemo(() => {
    if (!initialPowerPill.current) {
      return false;
    }
    return !pacPlayer.powerPill;
  }, [pacPlayer.powerPill]);

  useEffect(() => {
    if (usedPowerPill) {
      play("pacman-pill-safe");
    }
  }, [play, usedPowerPill]);

  const inJail = pacPlayer.jailTurnsCount > 0;
  const accentColor = tinycolor
    .mostReadable(pacPlayer.color, ["#fff", "#000"])
    .toHexString();

  const goingToJail = useMemo(() => {
    return inJail && pacPlayer.jailTurnsCount > startingJailMoves.current;
  }, [inJail, pacPlayer.jailTurnsCount]);

  return (
    <Container goingToJail={goingToJail}>
      <PacManGhostWithSantaHat
        color={inJail ? "#777777" : pacPlayer.color}
        width="3vw"
      />
      <PlayerName
        style={{
          backgroundColor: pacPlayer.color,
          borderColor: accentColor,
          color: accentColor,
        }}
      >
        {pacPlayer.player.name}
      </PlayerName>
      {pacPlayer.movesRemaining > 0 && (
        <MovesRemaining>{pacPlayer.movesRemaining}</MovesRemaining>
      )}
      {pacPlayer.powerPill && <PowerPill>💊</PowerPill>}
      {usedPowerPill && (
        <Appear>
          <SafeIndicator>SAFE</SafeIndicator>
        </Appear>
      )}
    </Container>
  );
}
