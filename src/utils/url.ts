export const playersRockPaperScissorsGameUrl = (
  playerId: string,
  gameId: string
): string => `/play/${playerId}/rock-paper-scissors?gameId=${gameId}`;
