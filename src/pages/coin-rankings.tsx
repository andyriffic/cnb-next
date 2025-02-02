import { GetStaticProps } from "next";
import { SpectatorPageLayout } from "../components/SpectatorPageLayout";
import { getAllPlayers } from "../utils/data/aws-dynamodb";
import { PlayerCoinRankings, groupPlayersByTotalCoins } from "../utils/player";
import ScreenView from "../components/pages/coin-rankings";

type Props = {
  coinRankings?: PlayerCoinRankings;
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

export const getStaticProps: GetStaticProps = async () => {
  const players = await getAllPlayers();

  if (!players) {
    return {
      props: {
        coinRankings: undefined,
      },
    };
  }

  const activePlayers = players.filter((p) => !p.details?.retired);

  return {
    props: {
      coinRankings: groupPlayersByTotalCoins(activePlayers),
    },
  };
};

export default Page;
