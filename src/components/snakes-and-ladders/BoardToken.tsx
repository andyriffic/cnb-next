import { useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import { PlayerAvatar } from "../PlayerAvatar";
import { BOARD_CELLS, BoardPlayer, canStartTurn, TurnPhase } from "./game";
import { useBoardTokenSound } from "./hooks/useBoardTokenSound";

const STEP_MS = 350;
const LANDED_PAUSE_MS = 400;
const SLIDE_MS = 1200;
const WORMHOLE_MS = 900;

/** How long each phase lasts before the turn advances */
const PHASE_DURATION_MS: Record<Exclude<TurnPhase, "idle">, number> = {
  moving: STEP_MS,
  landed: LANDED_PAUSE_MS,
  sliding: SLIDE_MS,
  "wormhole-in": WORMHOLE_MS,
  "wormhole-out": WORMHOLE_MS,
};

const getPositionTransition = (phase: TurnPhase): string => {
  if (phase === "sliding") {
    return `left ${SLIDE_MS}ms ease-in-out, top ${SLIDE_MS}ms ease-in-out`;
  }
  // Coming out of a wormhole the token jumps while it is shrunk to nothing
  if (phase === "wormhole-out") {
    return "none";
  }
  return `left ${STEP_MS - 50}ms ease-in-out, top ${STEP_MS - 50}ms ease-in-out, transform ${STEP_MS - 50}ms ease-in-out`;
};

const hopAnimation = keyframes`
  50% { margin-top: -2vh; }
`;

const intoWormholeAnimation = keyframes`
  0% { transform: scale(1) rotate(0deg); opacity: 1; }
  100% { transform: scale(0) rotate(720deg); opacity: 0; }
`;

const outOfWormholeAnimation = keyframes`
  0% { transform: scale(0) rotate(-720deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const Token = styled.button<{ $phase: TurnPhase }>`
  position: absolute;
  z-index: ${({ $phase }) => ($phase === "idle" ? 1 : 3)};
  display: grid;
  place-items: center;
  width: 8vh;
  height: 10vh;
  padding: 0;
  border: 0;
  border-radius: 1vh;
  background: transparent;
  cursor: pointer;
  transform-origin: center;
  ${({ $phase }) =>
    $phase === "moving" &&
    css`
      animation: ${hopAnimation} ${STEP_MS}ms ease-in-out infinite;
    `}

  &:focus-visible {
    outline: 3px solid #101820;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: default;
  }
`;

const WormholeTravel = styled.div<{ $phase: TurnPhase }>`
  position: relative;
  ${({ $phase }) =>
    $phase === "wormhole-in" &&
    css`
      animation: ${intoWormholeAnimation} ${WORMHOLE_MS}ms ease-in both;
    `}
  ${({ $phase }) =>
    $phase === "wormhole-out" &&
    css`
      animation: ${outOfWormholeAnimation} ${WORMHOLE_MS}ms ease-out both;
    `}
`;

const MoveCount = styled.span`
  position: absolute;
  right: -2px;
  bottom: -2px;
  display: grid;
  place-items: center;
  width: 3vh;
  height: 3vh;
  border: 2px solid white;
  border-radius: 50%;
  background: #172b3a;
  color: white;
  font-size: 1.6vh;
  font-weight: 700;
`;

type Props = {
  boardPlayer: BoardPlayer;
  stackOffset: [number, number];
  onStartTurn: (playerId: string) => void;
  onAdvance: (boardPlayer: BoardPlayer) => void;
};

export function BoardToken({
  boardPlayer,
  stackOffset: [offsetX, offsetY],
  onStartTurn,
  onAdvance,
}: Props) {
  const { player, cellIndex, movesRemaining, phase } = boardPlayer;
  const cell = BOARD_CELLS[cellIndex]!;
  useBoardTokenSound(boardPlayer);

  useEffect(() => {
    if (phase === "idle") {
      return;
    }
    const timeout = setTimeout(
      () => onAdvance(boardPlayer),
      PHASE_DURATION_MS[phase],
    );
    return () => clearTimeout(timeout);
  }, [boardPlayer, phase, onAdvance]);

  return (
    <Token
      type="button"
      $phase={phase}
      disabled={!canStartTurn(boardPlayer)}
      aria-label={`${player.name}, space ${cell.number}, ${movesRemaining} moves remaining`}
      title={`${player.name}: space ${cell.number}`}
      onClick={() => onStartTurn(player.id)}
      style={{
        left: `${cell.coordinates[0]}%`,
        top: `${cell.coordinates[1]}%`,
        transform: `translate(calc(-50% + ${offsetX}vh), calc(-50% + ${offsetY}vh))`,
        transition: getPositionTransition(phase),
      }}
    >
      <WormholeTravel $phase={phase}>
        <PlayerAvatar playerId={player.id} size="thumbnail" />
        {movesRemaining > 0 && <MoveCount>{movesRemaining}</MoveCount>}
      </WormholeTravel>
    </Token>
  );
}
