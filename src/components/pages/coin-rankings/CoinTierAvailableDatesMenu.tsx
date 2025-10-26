import { getMonthDisplayName } from "../../../utils/date";
import { PlayerCoinTotalByYearAndMonth } from "../../../utils/player";

type Props = {
  totalsByYearAndMonth: PlayerCoinTotalByYearAndMonth;
  onSelectDate: (year: number, month: number) => void;
};

export const CoinTierAvailableDatesMenu = ({
  totalsByYearAndMonth,
  onSelectDate,
}: Props) => {
  const years = Object.keys(totalsByYearAndMonth)
    .map((year) => parseInt(year))
    .sort((a, b) => b - a);

  return (
    <div>
      {years.map((year) => {
        const months = Object.keys(totalsByYearAndMonth[year]!)
          .map((month) => parseInt(month))
          .sort((a, b) => b - a);
        return (
          <div key={year}>
            <h3>{year}</h3>
            <ul>
              {months.map((month) => (
                <li key={month}>
                  <button onClick={() => onSelectDate(year, month)}>
                    {year} / {getMonthDisplayName(month)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
