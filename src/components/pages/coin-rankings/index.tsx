import styled from "styled-components";
import { PlayerCoinRankings } from "../../../utils/player";
import { SpectatorPageLayout } from "../../SpectatorPageLayout";
import { Appear } from "../../animations/Appear";
import { CoinTierDisplay } from "./CoinTierDisplay";
import { useCoinRankDisplayTiming } from "./useCoinRankDisplayTiming";

const Container = styled.div``;

type Props = {
  coinRankings: PlayerCoinRankings;
};

const View = ({ coinRankings }: Props) => {
  const coinUiState = useCoinRankDisplayTiming(coinRankings);
  return (
    <SpectatorPageLayout scrollable={true}>
      <button
        onClick={coinUiState.showNextTier}
        disabled={coinUiState.allTiersShown}
      >
        Next Tier
      </button>

      <Container>
        {coinUiState.tiers.map((tierUi) => {
          return (
            <Appear
              key={tierUi.totalCoins}
              animation="text-focus-in"
              show={tierUi.show}
            >
              <CoinTierDisplay
                coinTier={tierUi}
                onFinishedDisplaying={coinUiState.showNextTier}
              />
            </Appear>
          );
        })}
      </Container>
    </SpectatorPageLayout>
  );
};

export default View;
