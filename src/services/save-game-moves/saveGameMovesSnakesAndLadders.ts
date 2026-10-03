import { SnakesAndLaddersDetails } from "../../types/Player";
import { getPlayer, updatePlayer } from "../../utils/data/aws-dynamodb-players";
import { addToMonthlyCoinTotal } from "../../utils/player";
import { PlayerGameMoves } from "./types";

const updatePlayerGameMoves = (
  playerMoves: PlayerGameMoves,
  team?: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    getPlayer(playerMoves.playerId)
      .then((player) => {
        if (!player) {
          reject(new Error(`Player with id ${playerMoves.playerId} not found`));
          return;
        }

        if (
          team &&
          player.details?.team?.toLowerCase() !== team.toLowerCase()
        ) {
          console.log(
            "Skipping player",
            playerMoves.playerId,
            "not on team",
            team,
          );
          resolve();
          return;
        }

        const currentGameMoves = player.details?.gameMoves || 0;

        const snakesAndLaddersDetails: SnakesAndLaddersDetails = !player.details
          ?.snakesAndLadders
          ? {
              isParticipant: true,
              cellIndex: 0,
            }
          : { ...player.details.snakesAndLadders, isParticipant: true };

        const totalCoinsWon = !!playerMoves.winner ? 1 : 0;
        const availableCoins =
          (player.details?.availableCoins || 0) + totalCoinsWon;
        const totalCoins = (player.details?.totalCoins || 0) + totalCoinsWon;
        const monthlyCoinTotals = addToMonthlyCoinTotal(
          player.details?.monthlyCoinTotals,
          totalCoinsWon,
        );

        updatePlayer(playerMoves.playerId, {
          ...player.details,
          gameMoves: currentGameMoves + playerMoves.moves,
          snakesAndLadders: snakesAndLaddersDetails,
          totalCoins,
          availableCoins,
          monthlyCoinTotals,
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
  moves: PlayerGameMoves[],
  team?: string,
): Promise<void> => {
  if (updatedGameIds.includes(gameId)) {
    console.log(`Game ${gameId} already updated`, updatedGameIds);
    return Promise.resolve();
  }

  updatedGameIds.push(gameId);

  const promises = moves.map((move) => updatePlayerGameMoves(move, team));

  return Promise.all(promises).then(() => undefined);
};
