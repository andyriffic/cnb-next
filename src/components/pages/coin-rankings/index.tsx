import { useState } from "react";
import { getYearAndMonth } from "../../../utils/date";
import { PlayerCoinTotalByYearAndMonth } from "../../../utils/player";
import { SpectatorPageLayout } from "../../SpectatorPageLayout";
import { CoinTierAvailableDatesMenu } from "./CoinTierAvailableDatesMenu";
import { DisplayMonthlyCoinRankings } from "./DisplayMonthlyCoinRankings";

type Props = {
  coinRankings: PlayerCoinTotalByYearAndMonth;
};

const View = ({ coinRankings }: Props) => {
  const currentYearAndMonth = getYearAndMonth();
  const [selectedCoinRankings, setSelectedCoinRankings] = useState({
    year: currentYearAndMonth.year,
    month: currentYearAndMonth.month,
    rankings:
      coinRankings[currentYearAndMonth.year]?.[currentYearAndMonth.month],
  });

  return (
    <SpectatorPageLayout scrollable={true}>
      {/* <button
        onClick={coinUiState.showNextTier}
        disabled={coinUiState.allTiersShown}
      >
        Next Tier
      </button> */}
      <CoinTierAvailableDatesMenu
        totalsByYearAndMonth={coinRankings}
        onSelectDate={(year, month) => {
          setSelectedCoinRankings({
            year,
            month,
            rankings: coinRankings[year]?.[month],
          });
        }}
      />
      {selectedCoinRankings.rankings && (
        <DisplayMonthlyCoinRankings
          key={`${selectedCoinRankings.year}-${selectedCoinRankings.month}`}
          monthlyCoinTotals={selectedCoinRankings.rankings}
          year={selectedCoinRankings.year}
          month={selectedCoinRankings.month}
        />
      )}
    </SpectatorPageLayout>
  );
};

export default View;
