import { Player } from "../types/Player";

export type PlayerCoinRankings = PlayerCoinRankTier[];

export type PlayerCoinRankTier = {
  title: string;
  totalCoins: number;
  playerIds: string[];
  rank?: number;
};

export function groupPlayersByTotalCoins(
  players: Player[]
): PlayerCoinRankTier[] {
  const rankTiers = players.reduce<PlayerCoinRankTier[]>((acc, player) => {
    const playersTotalCoins = player.details?.totalCoins || 0;

    const existingTier = acc.find(
      (tier) => tier.totalCoins === playersTotalCoins
    );

    if (existingTier) {
      existingTier.playerIds.push(player.id);
    } else {
      acc.push({
        title: `Total Coins: ${playersTotalCoins}`,
        totalCoins: playersTotalCoins,
        playerIds: [player.id],
      });
    }
    return acc;
  }, []);

  rankTiers.sort((a, b) => b.totalCoins - a.totalCoins);
  return rankTiers.map((tier, index) => ({ ...tier, rank: index + 1 }));
}
