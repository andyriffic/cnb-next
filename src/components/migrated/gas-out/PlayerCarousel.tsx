import React, { useMemo, useRef } from "react";
import styled from "styled-components";
import { GasGame } from "../../../services/migrated/gas-out/types";
import { RotatingPlayerCarousel } from "./RotatingPlayerCarousel";

const PlayerListContainer = styled.div``;

type Props = {
  game: GasGame;
  gameOver: boolean;
  forcePlayerId: string | undefined;
};

export function PlayerCarousel({
  game,
  gameOver,
  forcePlayerId,
}: Props): JSX.Element {
  const indexRef = useRef(
    game.alivePlayersIds.findIndex((pid) => pid === game.currentPlayer.id)
  );
  const lastPlayerIdRef = useRef(game.currentPlayer.id);

  const displayIndex = useMemo(() => {
    // if (game.currentPlayer.pressesRemaining > 0) {
    //   return indexRef.current;
    // }

    if (forcePlayerId) {
      return game.alivePlayersIds.findIndex((pid) => pid === forcePlayerId);
    }

    if (lastPlayerIdRef.current === game.currentPlayer.id) {
      return indexRef.current;
    }

    if (game.deadPlayerIds.includes(lastPlayerIdRef.current)) {
      indexRef.current = game.alivePlayersIds.findIndex(
        (pid) => pid === game.currentPlayer.id
      );
    } else {
      indexRef.current =
        indexRef.current + (game.direction === "right" ? 1 : -1);
    }
    lastPlayerIdRef.current = game.currentPlayer.id;

    return indexRef.current;
  }, [game, forcePlayerId]);

  return (
    <PlayerListContainer>
      <RotatingPlayerCarousel
        game={game}
        gameOver={gameOver}
        displayIndex={displayIndex}
        transparent={true}
        forcePlayerId={forcePlayerId}
      />
    </PlayerListContainer>
  );
}
