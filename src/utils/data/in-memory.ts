import { AiOverlordGame } from "../../services/ai-overlord/types";

let aiOverlordGames: AiOverlordGame[] = [];

export const getInMemoryAiOverlordGame = (
  gameId: string
): AiOverlordGame | undefined => {
  return aiOverlordGames.find((game) => game.gameId === gameId);
};

export const updateInMemoryAiOverlordGame = (game: AiOverlordGame): void => {
  aiOverlordGames = [
    ...aiOverlordGames.filter((g) => g.gameId !== game.gameId),
    game,
  ];
};

export const getAllInMemoryAiOverlordGames = (): AiOverlordGame[] => {
  return aiOverlordGames;
};
