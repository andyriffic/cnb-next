import { get } from "http";
import { GetServerSideProps } from "next";
import ScreenView from "../components/pages/coin-rankings";
import { SpectatorPageLayout } from "../components/SpectatorPageLayout";
import { getAllPlayers } from "../utils/data/aws-dynamodb";
import {
  PlayerCoinTotalByYearAndMonth,
  getPlayersCoinRankingsForYearAndMonth,
  groupPlayersByTotalCoins,
} from "../utils/player";
import { hasTotalCoins, isRegularPlayer } from "../types/Player";
import { getYearAndMonth } from "../utils/date";

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
  const thisMonthsCoinRankings = getPlayersCoinRankingsForYearAndMonth(
    activePlayers,
    currentYearAndMonth.year,
    currentYearAndMonth.month
  );

  const coinRankings: PlayerCoinTotalByYearAndMonth = {
    [currentYearAndMonth.year]: {
      [currentYearAndMonth.month]: thisMonthsCoinRankings,
    },
  };

  return {
    props: {
      coinRankings,
    },
  };
};

export default Page;
