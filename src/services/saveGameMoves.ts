import { getPlayer, updatePlayer } from "../utils/data/aws-dynamodb";

export type PlayerGameMoves = {
  playerId: string;
  moves: number;
};

const updatePlayerGameMoves = (playerMoves: PlayerGameMoves): Promise<void> => {
  return new Promise((resolve, reject) => {
    getPlayer(playerMoves.playerId)
      .then((player) => {
        if (!player) {
          reject(new Error(`Player with id ${playerMoves.playerId} not found`));
          return;
        }

        const currentGameMoves = player.details?.gameMoves || 0;

        updatePlayer(playerMoves.playerId, {
          gameMoves: currentGameMoves + playerMoves.moves,
        })
          .then(resolve)
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

const updatedGameIds: string[] = [];

export const savePlayersGameMoves = (
  gameId: string,
  moves: PlayerGameMoves[]
): Promise<void[]> | Promise<void> => {
  if (updatedGameIds.includes(gameId)) {
    console.log(`Game ${gameId} already updated`, updatedGameIds);
    return Promise.resolve();
  }

  updatedGameIds.push(gameId);

  const promises = moves.map(updatePlayerGameMoves);

  return Promise.all(promises);
};
