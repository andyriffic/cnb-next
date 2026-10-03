import { useCallback, useState } from "react";
import { Player } from "../../../types/Player";
import { updateSnakesAndLaddersState } from "../../../utils/api";
import {
  advanceTurn,
  BoardPlayer,
  createBoardPlayers,
  startTurn,
} from "../game";

export type UseBoardPlayers = {
  boardPlayers: BoardPlayer[];
  startPlayerTurn: (playerId: string) => void;
  advancePlayer: (boardPlayer: BoardPlayer) => void;
  feedback: string;
};

export function useBoardPlayers(players: Player[]): UseBoardPlayers {
  const [boardPlayers, setBoardPlayers] = useState(() =>
    createBoardPlayers(players),
  );
  const [feedback, setFeedback] = useState("");

  const replacePlayer = (updated: BoardPlayer) =>
    setBoardPlayers((current) =>
      current.map((boardPlayer) =>
        boardPlayer.player.id === updated.player.id ? updated : boardPlayer,
      ),
    );

  const startPlayerTurn = useCallback((playerId: string) => {
    setFeedback("");
    setBoardPlayers((current) =>
      current.map((boardPlayer) =>
        boardPlayer.player.id === playerId
          ? startTurn(boardPlayer)
          : boardPlayer,
      ),
    );
  }, []);

  const advancePlayer = useCallback((boardPlayer: BoardPlayer) => {
    const updated = advanceTurn(boardPlayer);
    replacePlayer(updated);

    if (boardPlayer.phase !== "idle" && updated.phase === "idle") {
      updateSnakesAndLaddersState(
        updated.player.id,
        updated.cellIndex,
        updated.movesRemaining,
      ).catch(() => {
        setFeedback("Could not save the player position.");
      });
    }
  }, []);

  return { boardPlayers, startPlayerTurn, advancePlayer, feedback };
}
