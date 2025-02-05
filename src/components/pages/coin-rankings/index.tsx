import styled from "styled-components";
import { PlayerCoinRankings } from "../../../utils/player";
import { SmallHeading } from "../../Atoms";
import { SpectatorPageLayout } from "../../SpectatorPageLayout";
import { Appear } from "../../animations/Appear";
import { CoinTierDisplay } from "./CoinTierDisplay";
import { useCoinRankDisplayTiming } from "./useCoinRankDisplayTiming";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
  margin: 0 3rem;
`;

type Props = {
  coinRankings: PlayerCoinRankings;
};

const View = ({ coinRankings }: Props) => {
  const coinUiState = useCoinRankDisplayTiming(coinRankings);
  return (
    <SpectatorPageLayout scrollable={true}>
      {/* <button
        onClick={coinUiState.showNextTier}
        disabled={coinUiState.allTiersShown}
      >
        Next Tier
      </button> */}
      <SmallHeading style={{ marginBottom: "2rem" }}>
        February Coin Winners
      </SmallHeading>

      <Container>
        {coinUiState.tiers.map((tierUi) => {
          return tierUi.show ? (
            <Appear key={tierUi.totalCoins} animation="text-focus-in">
              <CoinTierDisplay
                coinTier={tierUi}
                onFinishedDisplaying={coinUiState.showNextTier}
              />
            </Appear>
          ) : null;
        })}
      </Container>
    </SpectatorPageLayout>
  );
};

export default View;
