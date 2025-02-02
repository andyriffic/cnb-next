import { useState } from "react";
import { PlayerCoinRankings, PlayerCoinRankTier } from "../../../utils/player";

export type CoinRankUiState = {
  tiers: PlayerCoinRankTierWithUi[];
  allTiersShown: boolean;
  showNextTier: () => void;
};

export type PlayerCoinRankTierWithUi = {
  totalCoins: number;
  playerIds: string[];
  show: boolean;
};

export const useCoinRankDisplayTiming = (
  coinRankings: PlayerCoinRankings
): CoinRankUiState => {
  const [coinRankUiTierState, setCoinRankUiTierState] = useState(
    getInititalState(coinRankings)
  );

  return {
    tiers: coinRankUiTierState,
    allTiersShown: coinRankUiTierState.every((tier) => tier.show),
    showNextTier: () =>
      setCoinRankUiTierState(showNextTier(coinRankUiTierState)),
  };
};

function showNextTier(
  tierUis: PlayerCoinRankTierWithUi[]
): PlayerCoinRankTierWithUi[] {
  const nextTier = tierUis.reverse().find((tier) => !tier.show);

  if (!nextTier) {
    return tierUis;
  }

  return tierUis.map((tier) => {
    if (tier.totalCoins === nextTier.totalCoins) {
      return { ...tier, show: true };
    }
    return tier;
  });
}

function getInititalState(
  coinRankings: PlayerCoinRankings
): PlayerCoinRankTierWithUi[] {
  const lowestTier = coinRankings[coinRankings.length - 1]!;
  return coinRankings.reduce<PlayerCoinRankTierWithUi[]>((acc, tier) => {
    acc.push({
      show: tier.totalCoins === lowestTier.totalCoins,
      ...tier,
    });
    return acc;
  }, []);
}
