export const playersRockPaperScissorsGameUrl = (
  playerId: string,
  gameId: string
): string => `/play/${playerId}/rock-paper-scissors?gameId=${gameId}`;

export const playersBettingGameUrl = (
  playerId: string,
  gameId: string
): string => `/play/${playerId}/bet?gameId=${gameId}`;

export const getPlayerAvatarUrl = (playerId: string): string => {
  return `/images/players/${playerId}.png`;
};
