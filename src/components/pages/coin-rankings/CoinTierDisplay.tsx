import { useEffect } from "react";
import styled from "styled-components";
import { PlayerAvatar } from "../../PlayerAvatar";
import { StaggerUiElementListDisplay } from "../../StaggerUiElementListDisplay";
import { SubHeading } from "../../Atoms";
import { getOrdinal } from "../../../utils/string";
import { CoinDisplay } from "./CoinDisplay";
import { PlayerCoinRankTierWithUi } from "./useCoinRankDisplayTiming";

const TierContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const PlayerList = styled.ul`
  display: flex;
  gap: 1rem;
`;

const PlayerListItem = styled.li`
  width: 2vw;
`;

type Props = {
  coinTier: PlayerCoinRankTierWithUi;
  onFinishedDisplaying: () => void;
};

export const CoinTierDisplay = ({ coinTier, onFinishedDisplaying }: Props) => {
  // useEffect(() => {
  //   setTimeout(() => {
  //     onFinishedDisplaying();
  //     console.log("finished displaying tier", coinTier.totalCoins);
  //   }, 1000);
  // }, [coinTier.totalCoins, onFinishedDisplaying]);

  return (
    <TierContainer>
      <div>
        <CoinDisplay totalCoins={coinTier.totalCoins} />
        {!!coinTier.rank && coinTier.rank <= 3 && (
          <SubHeading>{getOrdinal(coinTier.rank)}</SubHeading>
        )}
      </div>
      <PlayerList>
        <StaggerUiElementListDisplay
          onAllItemsDisplayed={onFinishedDisplaying}
          displayMilliseconds={800}
          soundKey="coin-rankings-show-player"
          uiElements={coinTier.playerIds.map((playerId) => {
            return (
              <PlayerListItem key={playerId}>
                <PlayerAvatar playerId={playerId} size="thumbnail" />
              </PlayerListItem>
            );
          })}
        />
      </PlayerList>
    </TierContainer>
  );
};
