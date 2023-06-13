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

export const getPlayerHomeUrl = (
  playerId: string,
  autoJoinGameId?: string
): string => {
  return `/play/${playerId}${
    autoJoinGameId ? `?autoJoinId=${autoJoinGameId}` : ""
  }`;
};

export const getPlayerJoinUrl = (
  playerId: string,
  autoJoinGameId?: string
): string => {
  return `/play/${playerId}/join${
    autoJoinGameId ? `?autoJoinId=${autoJoinGameId}` : ""
  }`;
};

export const getWhosThatUrl = (continueUrl?: string): string => {
  return `/whos-that${continueUrl ? `?continueUrl=${continueUrl}` : ""}`;
};

export const getPlayRootUrl = (autoJoinGameId?: string): string => {
  return `/play${autoJoinGameId ? `?autoJoinId=${autoJoinGameId}` : ""}`;
};

export const getRockPaperScissorsGameSpectatorUrl = (
  gameId: string
): string => {
  return `/watch/rock-paper-scissors/${gameId}`;
};

export const getAiOverlordSpectatorUrl = (gameId: string): string => {
  return `/watch/ai-overlord/${gameId}`;
};

export const getAiOverlordPlayerUrl = (
  playerId: string,
  gameId: string
): string => {
  return `/play/${playerId}/ai-overlord?gameId=${gameId}`;
};

export const getClassicCnbPlayerUrl = (playerId: string): string => {
  return `http://cnb.finx-rocks.com/play/${playerId}`;
};

export const getGasOutSpectatorUrl = (gameId: string): string => {
  return `/watch/gas-out/${gameId}`;
};

export const getGasOutPlayerUrl = (
  playerId: string,
  gameId: string
): string => {
  return `/play/${playerId}/gas-out?gameId=${gameId}`;
};
