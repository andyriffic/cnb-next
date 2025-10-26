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
  const selectedMonth =
    coinRankings[currentYearAndMonth.year]?.[currentYearAndMonth.month];

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
        onSelectDate={() => {}}
      />
      {selectedMonth && (
        <DisplayMonthlyCoinRankings
          key={`${currentYearAndMonth.year}-${currentYearAndMonth.month}`}
          monthlyCoinTotals={selectedMonth}
          year={currentYearAndMonth.year}
          month={currentYearAndMonth.month}
        />
      )}
    </SpectatorPageLayout>
  );
};

export default View;
