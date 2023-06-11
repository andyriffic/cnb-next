import React, { useMemo } from "react";
import styled from "styled-components";
import { fadeInDownAnimation } from "../../animations/keyframes/fade";
import { GasGame, GasPlayer } from "../../../services/migrated/gas-out/types";
import { Heading } from "../../Atoms";

const TextContainer = styled.div`
  margin-top: 30px;
  animation: ${fadeInDownAnimation} 1500ms ease-in-out 0s 1 both;
`;

type Props = {
  game: GasGame;
};

export function Winner({ game }: Props): JSX.Element | null {
  const winningPlayer = useMemo<GasPlayer | undefined>(() => {
    if (!game.winningPlayerId) {
      return;
    }

    return game.allPlayers.find((p) => p.status === "winner");
  }, [game]);

  return winningPlayer ? (
    <TextContainer>
      <Heading>{winningPlayer.player.name} wins 🥳</Heading>
    </TextContainer>
  ) : null;
}
