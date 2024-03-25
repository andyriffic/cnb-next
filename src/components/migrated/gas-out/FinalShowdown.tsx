import { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { FONT_FAMILY } from "../../../colors";
import { GasGame } from "../../../services/migrated/gas-out/types";
import { PlayerCarouselPlayer } from "./PlayerCarouselPlayer";

const Container = styled.div`
  margin-top: 150px;
  display: flex;
  justify-content: center;
  gap: 30px;
`;

const PlayerContainer = styled.div<{ isActive: boolean }>`
  width: 100%;
  box-sizing: border-box;
  padding: 0;
  display: flex;
  justify-content: center;
  position: relative;
  transition: transform 0.3s;
  ${({ isActive }) =>
    css`
      transform: scale(${isActive ? 1 : 0.7});
    `}
`;

const Number = styled.div`
  font-size: 1rem;
  color: #222;
  font-family: ${FONT_FAMILY.numeric};
  text-align: center;
  font-weight: bold;
`;

type Props = {
  game: GasGame;
  gameOver: boolean;
};

export function FinalShowdown({ game, gameOver }: Props): JSX.Element | null {
  const allSurvivingPlayers = useMemo(
    () => game.allPlayers.filter((p) => p.status === "alive"),
    [game]
  );

  const [player1Id] = useState(allSurvivingPlayers[0]);
  const [player2Id] = useState(allSurvivingPlayers[1]);

  const player1 = useMemo(() => allSurvivingPlayers[0], [allSurvivingPlayers]);
  const player2 = useMemo(() => allSurvivingPlayers[1], [allSurvivingPlayers]);

  if (!(player1 && !player2) && allSurvivingPlayers.length !== 2) {
    return null;
  }

  return (
    <Container>
      {player1 && (
        <PlayerContainer isActive={game.currentPlayer.id === player1.player.id}>
          <PlayerCarouselPlayer
            game={game}
            gameOver={gameOver}
            player={player1}
          />
        </PlayerContainer>
      )}
      {player2 && (
        <PlayerContainer isActive={game.currentPlayer.id === player2.player.id}>
          <PlayerCarouselPlayer
            game={game}
            gameOver={gameOver}
            player={player2}
          />
        </PlayerContainer>
      )}
    </Container>
  );
}
