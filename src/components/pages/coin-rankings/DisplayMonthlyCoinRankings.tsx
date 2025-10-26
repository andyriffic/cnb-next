import styled from "styled-components";
import { getMonthDisplayName } from "../../../utils/date";
import { PlayerCoinRankTier } from "../../../utils/player";
import { SmallHeading } from "../../Atoms";
import { Appear } from "../../animations/Appear";
import { useSound } from "../../hooks/useSound";
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
  monthlyCoinTotals: PlayerCoinRankTier[];
  year: number;
  month: number;
};

export const DisplayMonthlyCoinRankings = ({
  monthlyCoinTotals,
  year,
  month,
}: Props) => {
  const coinUiState = useCoinRankDisplayTiming(monthlyCoinTotals);

  const { play } = useSound();

  const tierFinished = () => {
    if (!coinUiState.allTiersShown) {
      coinUiState.showNextTier();
      return;
    }

    play("coin-rankings-end");
  };

  return (
    <>
      <SmallHeading style={{ marginBottom: "2rem" }}>
        {getMonthDisplayName(month)} {year} Coin Winners
      </SmallHeading>

      <Container>
        {coinUiState.tiers.map((tierUi) => {
          return tierUi.show ? (
            <Appear key={tierUi.totalCoins} animation="text-focus-in">
              <CoinTierDisplay
                coinTier={tierUi}
                onFinishedDisplaying={tierFinished}
              />
            </Appear>
          ) : null;
        })}
      </Container>
    </>
  );
};
