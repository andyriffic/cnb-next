import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { FONT_FAMILY } from "../../../colors";
import { GasGame } from "../../../services/migrated/gas-out/types";
import { SubHeading } from "../../Atoms";
import { PlayerAvatar } from "../../PlayerAvatar";
import {
  fadeInDownAnimation,
  fadeInLeftAnimation,
} from "../../animations/keyframes/fade";
import { useSound } from "../../hooks/useSound";
import { PlayerListPlayer } from "./PlayerListPlayer";
import { PlayerCarouselPlayer } from "./PlayerCarouselPlayer";

const Container = styled.div`
  margin-top: 150px;
  display: flex;
  justify-content: center;
  gap: 30px;
`;

const PlayerContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 0;
  display: flex;
  justify-content: center;
  position: relative;
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
  const [allSurvivingPlayers] = useState(
    game.allPlayers.filter((p) => p.status === "alive")
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
        <PlayerContainer>
          <PlayerCarouselPlayer
            game={game}
            gameOver={gameOver}
            player={player1}
          />
        </PlayerContainer>
      )}
      {player2 && (
        <PlayerContainer>
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
