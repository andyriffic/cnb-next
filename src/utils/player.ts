import { MonthlyCoinTotals, Player } from "../types/Player";
import { getDayOfMonth, getMonthNumber } from "./date";

export type PlayerCoinTotalByYearAndMonth = {
  [year: number]: {
    [month: number]: PlayerCoinRankTier[];
  };
};

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

export function getPlayersCoinRankingsForYearAndMonth(
  players: Player[],
  year: number,
  month: number
): PlayerCoinRankTier[] {
  const rankTiers = players.reduce<PlayerCoinRankTier[]>((acc, player) => {
    const playersTotalCoins =
      player.details?.monthlyCoinTotals?.[year]?.[month] || 0;

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

export function addToMonthlyCoinTotal(
  currentTotals: MonthlyCoinTotals | undefined = {},
  coinsToAdd: number,
  date: Date = new Date()
): MonthlyCoinTotals {
  const year = date.getFullYear();
  const month = getMonthNumber(date);
  const yearTotals = currentTotals[year] || {};
  const monthTotal = yearTotals[month] || 0;
  return {
    ...currentTotals,
    [year]: {
      ...yearTotals,
      [month]: monthTotal + coinsToAdd,
    },
  };
}
