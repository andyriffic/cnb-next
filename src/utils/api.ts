import {
  ApiAiOverlordNewOpponentRequest,
  ApiGameCreationRequest,
} from "../pages/api/ai-overlord";
import { CreatePlayerParams } from "../pages/api/player";
import { AiOverlordGame } from "../services/ai-overlord/types";
import { PlayerGameMoves } from "../services/save-game-moves/types";
import { Player, PlayerDetails } from "../types/Player";

export const addPlayerFetch = (params: CreatePlayerParams): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/api/player`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then(() => resolve())
      .catch((reason) => {
        console.log(reason);
        reject(reason);
      });
  });
};

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

export const deletePlayerZombieDetails = (playerId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/api/player/${playerId}/delete/zombie`, {
      method: "DELETE",
    })
      .then(() => resolve())
      .catch((reason) => {
        console.log(reason);
        reject(reason);
      });
  });
};
export const deletePlayerPacmanDetails = (playerId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/api/player/${playerId}/delete/pacman`, {
      method: "DELETE",
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
  gameMoves: PlayerGameMoves[],
  team?: string
): Promise<Response> => {
  return fetch(
    `/api/save-game-moves?gameId=${gameId}${team ? `&team=${team}` : ""}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameMoves),
    }
  );
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

export const fetchCreateAiOverlordGame = (
  request: ApiGameCreationRequest
): Promise<AiOverlordGame> => {
  return fetch(`/api/ai-overlord`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  }).then((response) => response.json());
};

export const fetchStartAiOverlordBattle = (
  request: ApiAiOverlordNewOpponentRequest
): Promise<AiOverlordGame> => {
  return fetch(`/api/ai-overlord`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  }).then((response) => response.json());
};

export const fetchGetAiOverlordGame = (
  gameId: string
): Promise<AiOverlordGame | undefined> => {
  return fetch(`/api/ai-overlord?overlordId=${gameId}`, {
    method: "GET",
  }).then((response) =>
    response.status === 200 ? response.json() : undefined
  );
};

export const fetchGetPlayer = (
  playerId: string
): Promise<Player | undefined> => {
  return fetch(`/api/player/${playerId}`, {
    method: "GET",
  }).then((response) =>
    response.status === 200 ? response.json() : undefined
  );
};
