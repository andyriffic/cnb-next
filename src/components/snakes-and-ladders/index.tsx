import styled from "styled-components";
import { Player } from "../../types/Player";
import { bounceInTopAnimation } from "../animations/keyframes/bounceInTop";
import { PlayerAvatar } from "../PlayerAvatar";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { BoardToken } from "./BoardToken";
import { BOARD_CELLS, isWinner } from "./game";
import { useBoardPlayers } from "./hooks/useBoardPlayers";

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

const WormholeMarker = styled.img`
  position: absolute;
  z-index: 0;
  width: 7vh;
  height: 7vh;
  pointer-events: none;
  transform: translate(-50%, -50%);
  animation: wormhole-spin 10s linear infinite;

  @keyframes wormhole-spin {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

const WinnerBanner = styled(BoardOverlay)`
  top: 30%;
  left: 50%;
  z-index: 4;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 32px;
  margin-left: -10vw;
  width: 20vw;
  box-shadow: 1px 2px 15px 5px rgba(0, 0, 0, 0.6);
  background: white;
  animation: ${bounceInTopAnimation} 1.5s ease-in both;
`;

const WinnerHeading = styled.h2`
  margin: 0;
  font-size: 2rem;
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

const wormholeCells = BOARD_CELLS.filter((cell) => cell.kind === "wormhole");

export default function SnakesAndLadders({ players }: Props) {
  const { boardPlayers, startPlayerTurn, advancePlayer, feedback } =
    useBoardPlayers(players);

  const winningPlayer = boardPlayers.find(
    (boardPlayer) => isWinner(boardPlayer) && boardPlayer.phase === "idle",
  );

  return (
    <SpectatorPageLayout>
      <BoardFrame aria-label="Snakes and ladders game board">
        <PageHeader>
          <Heading>Snakes &amp; Ladders</Heading>
          <ParticipantCount>{boardPlayers.length} players</ParticipantCount>
        </PageHeader>
        {wormholeCells.map((cell) => (
          <WormholeMarker
            key={cell.number}
            src="/images/snakes-and-ladders-vortex.png"
            alt=""
            style={{
              left: `${cell.coordinates[0]}%`,
              top: `${cell.coordinates[1]}%`,
            }}
          />
        ))}
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

          return (
            <BoardToken
              key={boardPlayer.player.id}
              boardPlayer={boardPlayer}
              stackOffset={getStackOffset(
                stackPosition,
                sameCellPlayers.length,
              )}
              onStartTurn={startPlayerTurn}
              onAdvance={advancePlayer}
            />
          );
        })}
        {winningPlayer && (
          <WinnerBanner role="status">
            <WinnerHeading>🏆 Winner! 🏆</WinnerHeading>
            <PlayerAvatar playerId={winningPlayer.player.id} size="medium" />
            <p style={{ margin: 0, fontWeight: 700 }}>
              {winningPlayer.player.name}
            </p>
          </WinnerBanner>
        )}
        <BoardFooter>
          <BoardLegend aria-label="Board legend">
            <span>🐍 Snake</span>
            <span>🪜 Ladder</span>
            <span>🌀 Wormhole</span>
          </BoardLegend>
          <Feedback role="status">{feedback}</Feedback>
        </BoardFooter>
      </BoardFrame>
    </SpectatorPageLayout>
  );
}
