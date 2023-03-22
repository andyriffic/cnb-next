import { PlayerGameMoves } from "../services/saveGameMoves";
import { PlayerDetails } from "../types/Player";

export const updatePlayerDetails = (
  playerId: string,
  details: Partial<PlayerDetails>
): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/api/player/${playerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    })
      .then(() => resolve())
      .catch((reason) => {
        console.log(reason);
        reject(reason);
      });
  });
};

export const savePlayerGameMovesFetch = (
  gameId: string,
  gameMoves: PlayerGameMoves[]
): Promise<Response> => {
  return fetch(`/api/save-game-moves?gameId=${gameId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gameMoves),
  });
};

export const incrementPlayersWhosThatCountFetch = (
  playerId: string
): Promise<Response> => {
  return fetch(`/api/player/${playerId}/viewed-whos-that`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
