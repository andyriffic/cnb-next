import { useCallback, useMemo } from "react";
import {
  GasGame,
  GasPlayer,
} from "../../../../services/migrated/gas-out/types";
import { useSocketIo } from "../../../../providers/SocketIoProvider";

type UsePlayerGasGame = {
  game: GasGame | undefined;
  gasPlayer: GasPlayer | undefined;
  playersTurn: boolean;
  playPlayersCard: (cardIndex: number) => void;
  pressesRemaining: number;
  pressCloud: () => void;
  timeOut: () => void;
  statusText: string;
  guessNextPlayerOut: (guessPlayerId: string) => void;
};

function getPlayerStatusText(
  playersTurn: boolean,
  game: GasGame | undefined,
  gasPlayer: GasPlayer | undefined
): string {
  if (!(game && gasPlayer)) {
    return "";
  }

  if (gasPlayer.status === "dead") {
    return "R.I.P. ☠️";
  }

  if (gasPlayer.status === "winner") {
    return "You won 🎉";
  }

  if (!playersTurn) {
    return "Waiting for your turn";
  }

  if (!game.currentPlayer.cardPlayed) {
    return "Pick a card";
  }

  if (game.currentPlayer.pressesRemaining) {
    return "Press the button 😅";
  }

  if (
    game.currentPlayer.pressesRemaining === 0 &&
    gasPlayer.status === "alive"
  ) {
    return "You survived 🥳";
  }

  return "¯_(ツ)_/¯";
}

export function usePlayerGasGame(
  playerId: string,
  gameId: string
): UsePlayerGasGame {
  const {
    gasGame: {
      gasGames,
      playCard,
      pressGas,
      guessNextOutPlayer,
      timeoutPlayer,
    },
  } = useSocketIo();

  const game = gasGames.find((g) => g.id === gameId);

  const gasPlayer = useMemo(() => {
    return game && game.allPlayers.find((p) => p.player.id === playerId);
  }, [game, playerId]);

  const playersTurn = useMemo(() => {
    if (!game) {
      return false;
    }
    return game.currentPlayer.id === playerId;
  }, [game, playerId]);

  const pressesRemaining = useMemo(() => {
    if (!game) {
      return 0;
    }
    return game.currentPlayer.id === playerId
      ? game.currentPlayer.pressesRemaining
      : 0;
  }, [game, playerId]);

  const playPlayersCard = useCallback(
    (cardIndex: number) => {
      playCard(gameId, playerId, cardIndex);
    },
    [gameId, playCard, playerId]
  );

  const timeOut = useCallback(() => {
    timeoutPlayer(gameId, playerId);
  }, [gameId, playerId, timeoutPlayer]);

  const guessNextPlayerOut = useCallback(
    (guessPlayerId: string) => {
      guessNextOutPlayer(gameId, playerId, guessPlayerId);
    },
    [gameId, guessNextOutPlayer, playerId]
  );

  const pressCloud = useCallback(() => {
    pressGas(gameId);
  }, [gameId, pressGas]);

  return {
    game,
    gasPlayer,
    playersTurn,
    playPlayersCard,
    pressesRemaining,
    pressCloud,
    timeOut,
    statusText: getPlayerStatusText(playersTurn, game, gasPlayer),
    guessNextPlayerOut,
  };
}
