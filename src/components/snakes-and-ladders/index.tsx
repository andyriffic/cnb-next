import { useRef, useState } from "react";
import styled from "styled-components";
import { Player } from "../../types/Player";
import { updateSnakesAndLaddersState } from "../../utils/api";
import { PlayerAvatar } from "../PlayerAvatar";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { BOARD_CELLS, createBoardPlayers, getLandingCellIndex } from "./game";

const STEP_DELAY_MS = 350;

const BoardFrame = styled.main`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: url("/images/snakes-and-ladders-board.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
`;

const BoardOverlay = styled.div`
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 8px 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  color: #101820;
`;

const PageHeader = styled(BoardOverlay).attrs({ as: "header" })`
  top: 1%;
  left: 1%;
`;

const BoardFooter = styled(BoardOverlay)`
  bottom: 1%;
  right: 1%;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  line-height: 1.1;
`;

const ParticipantCount = styled.p`
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.8;
`;

const PlayerToken = styled.button<{ $moving: boolean }>`
  position: absolute;
  z-index: 1;
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
  animation: ${({ $moving }) =>
    $moving ? "token-hop 500ms ease-in-out infinite" : "none"};

  &:focus-visible {
    outline: 3px solid #101820;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: default;
  }

  @keyframes token-hop {
    50% {
      margin-top: -2vh;
    }
  }
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

const BoardLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const Feedback = styled.p`
  margin: 0;
  color: #9b2525;
`;

const EmptyBoard = styled(BoardOverlay).attrs({ as: "p" })`
  top: 50%;
  left: 50%;
  margin: 0;
  transform: translate(-50%, -50%);
`;

const getStackOffset = (position: number, total: number): [number, number] => {
  const columns = Math.ceil(Math.sqrt(total));
  const rows = Math.ceil(total / columns);
  const column = position % columns;
  const row = Math.floor(position / columns);
  return [(column - (columns - 1) / 2) * 4, (row - (rows - 1) / 2) * 3];
};

type Props = { players: Player[] };

export default function SnakesAndLadders({ players }: Props) {
  const [boardPlayers, setBoardPlayers] = useState(() =>
    createBoardPlayers(players),
  );
  const [feedback, setFeedback] = useState("");
  const movingPlayers = useRef(new Set<string>());

  const startTurn = (playerId: string) => {
    const selectedPlayer = boardPlayers.find(
      (boardPlayer) => boardPlayer.player.id === playerId,
    );
    if (
      !selectedPlayer ||
      selectedPlayer.movesRemaining <= 0 ||
      selectedPlayer.cellIndex === BOARD_CELLS.length - 1 ||
      movingPlayers.current.has(playerId)
    ) {
      return;
    }

    movingPlayers.current.add(playerId);
    setFeedback("");
    setBoardPlayers((current) =>
      current.map((boardPlayer) =>
        boardPlayer.player.id === playerId
          ? { ...boardPlayer, isMoving: true }
          : boardPlayer,
      ),
    );

    let cellIndex = selectedPlayer.cellIndex;
    let movesRemaining = selectedPlayer.movesRemaining;
    const moveOneSpace = () => {
      cellIndex = Math.min(cellIndex + 1, BOARD_CELLS.length - 1);
      movesRemaining -= 1;
      setBoardPlayers((current) =>
        current.map((boardPlayer) =>
          boardPlayer.player.id === playerId
            ? { ...boardPlayer, cellIndex, movesRemaining }
            : boardPlayer,
        ),
      );

      if (movesRemaining > 0) {
        window.setTimeout(moveOneSpace, STEP_DELAY_MS);
        return;
      }

      window.setTimeout(() => {
        cellIndex = getLandingCellIndex(cellIndex);
        movingPlayers.current.delete(playerId);
        setBoardPlayers((current) =>
          current.map((boardPlayer) =>
            boardPlayer.player.id === playerId
              ? {
                  ...boardPlayer,
                  cellIndex,
                  movesRemaining: 0,
                  isMoving: false,
                }
              : boardPlayer,
          ),
        );
        updateSnakesAndLaddersState(playerId, cellIndex, 0).catch(() => {
          setFeedback("Could not save the player position.");
        });
      }, STEP_DELAY_MS);
    };

    window.setTimeout(moveOneSpace, STEP_DELAY_MS);
  };

  const winningPlayer = boardPlayers.find(
    (boardPlayer) => boardPlayer.cellIndex === BOARD_CELLS.length - 1,
  );

  return (
    <SpectatorPageLayout>
      <BoardFrame aria-label="Snakes and ladders game board">
        <PageHeader>
          <Heading>Snakes &amp; Ladders</Heading>
          <ParticipantCount>{boardPlayers.length} players</ParticipantCount>
        </PageHeader>
        {boardPlayers.length === 0 && (
          <EmptyBoard>No players are currently on the board.</EmptyBoard>
        )}
        {boardPlayers.map((boardPlayer) => {
          const sameCellPlayers = boardPlayers.filter(
            (candidate) => candidate.cellIndex === boardPlayer.cellIndex,
          );
          const stackPosition = sameCellPlayers.findIndex(
            (candidate) => candidate.player.id === boardPlayer.player.id,
          );
          const [offsetX, offsetY] = getStackOffset(
            stackPosition,
            sameCellPlayers.length,
          );
          const cell = BOARD_CELLS[boardPlayer.cellIndex]!;
          const isWinner = boardPlayer.cellIndex === BOARD_CELLS.length - 1;

          return (
            <PlayerToken
              key={boardPlayer.player.id}
              type="button"
              $moving={boardPlayer.isMoving}
              disabled={
                boardPlayer.movesRemaining === 0 ||
                boardPlayer.isMoving ||
                isWinner
              }
              aria-label={`${boardPlayer.player.name}, space ${cell.number}, ${boardPlayer.movesRemaining} moves remaining`}
              title={`${boardPlayer.player.name}: space ${cell.number}`}
              onClick={() => startTurn(boardPlayer.player.id)}
              style={{
                left: `${cell.coordinates[0]}%`,
                top: `${cell.coordinates[1]}%`,
                transform: `translate(calc(-50% + ${offsetX}vh), calc(-50% + ${offsetY}vh))`,
              }}
            >
              <PlayerAvatar playerId={boardPlayer.player.id} size="thumbnail" />
              {boardPlayer.movesRemaining > 0 && (
                <MoveCount>{boardPlayer.movesRemaining}</MoveCount>
              )}
            </PlayerToken>
          );
        })}
        <BoardFooter>
          <BoardLegend aria-label="Board legend">
            <span>🐍 Snake</span>
            <span>🪜 Ladder</span>
            <span>🌀 Wormhole</span>
          </BoardLegend>
          {winningPlayer && (
            <p style={{ margin: 0 }}>Winner: {winningPlayer.player.name}</p>
          )}
          <Feedback role="status">{feedback}</Feedback>
        </BoardFooter>
      </BoardFrame>
    </SpectatorPageLayout>
  );
}
