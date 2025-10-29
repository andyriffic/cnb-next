import { get } from "http";
import { GetServerSideProps } from "next";
import ScreenView from "../components/pages/coin-rankings";
import { SpectatorPageLayout } from "../components/SpectatorPageLayout";
import { getAllPlayers } from "../utils/data/aws-dynamodb";
import {
  PlayerCoinRankTier,
  PlayerCoinTotalByYearAndMonth,
  getPlayersCoinRankingsForYearAndMonth,
  groupPlayersByTotalCoins,
} from "../utils/player";
import { hasTotalCoins, isRegularPlayer } from "../types/Player";
import { getPreviousYearAndMonth, getYearAndMonth } from "../utils/date";

type Props = {
  coinRankings?: PlayerCoinTotalByYearAndMonth;
};

function Page({ coinRankings }: Props) {
  if (!coinRankings) {
    return (
      <SpectatorPageLayout scrollable={true}>
        <div>Error getting coin rankings 😢</div>
      </SpectatorPageLayout>
    );
  }

  return <ScreenView coinRankings={coinRankings} />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const players = await getAllPlayers();

  if (!players) {
    return {
      props: {
        coinRankings: undefined,
      },
    };
  }

  const activePlayers = players.filter((p) => isRegularPlayer(p));
  const currentYearAndMonth = getYearAndMonth();
  const previousYearAndMonth = getPreviousYearAndMonth(
    currentYearAndMonth.year,
    currentYearAndMonth.month
  );
  const thisMonthsCoinRankings = getPlayersCoinRankingsForYearAndMonth(
    activePlayers,
    currentYearAndMonth.year,
    currentYearAndMonth.month
  );
  const previousMonthsCoinRankings = getPlayersCoinRankingsForYearAndMonth(
    activePlayers,
    previousYearAndMonth.year,
    previousYearAndMonth.month
  );

  const coinRankings = combineCoinRankings([
    {
      year: currentYearAndMonth.year,
      month: currentYearAndMonth.month,
      rankings: thisMonthsCoinRankings,
    },
    {
      year: previousYearAndMonth.year,
      month: previousYearAndMonth.month,
      rankings: previousMonthsCoinRankings,
    },
  ]);

  return {
    props: {
      coinRankings,
    },
  };
};

export default Page;

function combineCoinRankings(
  rankings: { year: number; month: number; rankings: PlayerCoinRankTier[] }[]
): { [year: number]: { [month: number]: PlayerCoinRankTier[] } } {
  const result: { [year: number]: { [month: number]: PlayerCoinRankTier[] } } =
    {};

  rankings.forEach(({ year, month, rankings }) => {
    if (!result[year]) {
      result[year] = {};
    }
    result[year]![month] = rankings;
  });

  return result;
}
