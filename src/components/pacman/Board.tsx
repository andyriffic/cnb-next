import styled from "styled-components";
import { isClientSideFeatureEnabled } from "../../utils/feature";
import { BoardPlayer } from "./BoardPlayer";
import { BoardSquare } from "./BoardSquare";
import { PacMan } from "./PacMan";
import { boardConfig } from "./boardConfig";
import { getCoordinatesForOffset } from "./coordinateOffsets";
import { PacManUiState } from "./hooks/usePacman/reducer";
import { Coordinates } from "./types";

const debug = false;

const BoardBackground = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
`;

const BoardBackgroundImage = styled.img`
  width: 100%;
  height: 100%;
`;

const PositionedPlayer = styled.div<{
  position: Coordinates;
  offset: Coordinates;
  moveSpeedMs: number;
}>`
  position: absolute;
  top: ${({ position, offset }) =>
    boardConfig.gridCoordinates.y[position.y]! + offset.y}%;
  left: ${({ position, offset }) =>
    boardConfig.gridCoordinates.x[position.x]! + offset.x}%;
  width: 5%;
  height: 5%;
  text-align: center;
  transition: top linear ${({ moveSpeedMs }) => moveSpeedMs}ms,
    left linear ${({ moveSpeedMs }) => moveSpeedMs}ms;

  &:hover {
    z-index: 1;
  }
`;

type Props = {
  uiState: PacManUiState;
};

export function Board({ uiState }: Props): JSX.Element {
  return (
    <BoardBackground>
      <BoardBackgroundImage src="/images/pacman/pac-man-board.png" />
      {boardConfig.playerPath.map((s, i) => (
        <BoardSquare
          key={i}
          square={s}
          color="white"
          content={
            <span style={{ transform: "translate3d(0.6rem, -0.2rem, 0)" }}>
              {debug ? i : <span style={{ fontSize: "2rem" }}>.</span>}
            </span>
          }
        />
      ))}
      {debug &&
        boardConfig.pacManPath.map((s, i) => {
          return (
            <BoardSquare
              key={i}
              square={s}
              color="red"
              content={
                <span style={{ transform: "translateY(1vw)" }}>
                  <br />
                  {i}
                </span>
              }
            />
          );
        })}
      {uiState.allPacPlayers.map((p) => {
        const square = boardConfig.playerPath[p.pathIndex];
        const playerPosition =
          p.jailTurnsCount > 0
            ? uiState.board.jailLocations[p.jailTurnsCount - 1]
            : square!.coordinates;
        const moveSpeed = p.jailTurnsCount > 0 ? 1000 : 240;
        return (
          <PositionedPlayer
            key={p.player.id}
            position={playerPosition!}
            offset={getCoordinatesForOffset(p.offset)}
            moveSpeedMs={moveSpeed}
          >
            <BoardPlayer pacPlayer={p} />
          </PositionedPlayer>
        );
      })}
      <PositionedPlayer
        moveSpeedMs={240}
        offset={{ x: 0, y: 0 }}
        position={boardConfig.pacManPath[uiState.pacMan.pathIndex]!.coordinates}
      >
        <PacMan state={uiState} />
      </PositionedPlayer>
    </BoardBackground>
  );
}
