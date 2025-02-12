import { useCallback, useMemo, useState } from "react";
import { PlayerCoinRankings, PlayerCoinRankTier } from "../../../utils/player";

export type CoinRankUiState = {
  tiers: PlayerCoinRankTierWithUi[];
  allTiersShown: boolean;
  showNextTier: () => void;
};

export type PlayerCoinRankTierWithUi = PlayerCoinRankTier & {
  show: boolean;
};

export const useCoinRankDisplayTiming = (
  coinRankings: PlayerCoinRankings
): CoinRankUiState => {
  const [coinRankUiTierState, setCoinRankUiTierState] = useState(
    getInititalState(coinRankings)
  );

  const showNextTier = useCallback(() => {
    setCoinRankUiTierState(setNextTierToShow(coinRankUiTierState));
  }, [coinRankUiTierState]);

  return {
    tiers: coinRankUiTierState,
    allTiersShown: coinRankUiTierState.every((tier) => tier.show),
    showNextTier,
  };

  function setNextTierToShow(
    tierUis: PlayerCoinRankTierWithUi[]
  ): PlayerCoinRankTierWithUi[] {
    const nextTier = [...tierUis].reverse().find((tier) => !tier.show);

    if (!nextTier) {
      return tierUis;
    }

    console.log("showing next tier", nextTier);

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
};
