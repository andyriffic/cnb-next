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
