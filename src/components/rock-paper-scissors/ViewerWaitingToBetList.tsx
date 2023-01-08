import { useMemo, useRef } from "react";
import { COLORS } from "../../colors";
import { usePlayerNames } from "../../providers/PlayerNamesProvider";
import {
  GroupPlayerBettingRound,
  PlayerWallet,
} from "../../services/betting/types";
import { CenteredCard, SubHeading, Heading, CaptionText } from "../Atoms";
import { CenterSpaced } from "../Layouts";
import { PlayerAvatar } from "../PlayerAvatar";

type BetState =
  | "broke"
  | "waiting"
  | "result-win"
  | "result-lose"
  | "bet"
  | "show-wallet";

const sortWalletByBetMostToLeastBetAmount = (
  a: PlayerWallet,
  b: PlayerWallet
) => b.value - a.value;

const getBetState = (
  round: GroupPlayerBettingRound,
  wallet: PlayerWallet,
  reveal: boolean,
  showWallet: boolean
): { state: BetState } => {
  if (showWallet) {
    return { state: "show-wallet" };
  }

  if (reveal && wallet.value === 0) {
    return { state: "broke" };
  }

  const currentBet = round.playerBets.find(
    (b) => b.playerId === wallet.playerId
  );

  const currentResult = round.result?.playerResults.find(
    (r) => r.playerId === wallet.playerId
  );

  if (!reveal && currentBet) {
    return { state: "bet" };
  }

  if (reveal && currentResult) {
    return {
      state: currentResult.totalWinnings > 0 ? "result-win" : "result-lose",
    };
  }

  return { state: "waiting" };
};

type Props = {
  wallets: PlayerWallet[];
  bettingRound: GroupPlayerBettingRound;
  revealResult: boolean;
  showNewWalletOrder: boolean;
};

export const ViewerWaitingToBetList = ({
  wallets,
  bettingRound,
  revealResult,
  showNewWalletOrder,
}: Props): JSX.Element => {
  const { names } = usePlayerNames();
  const previousWalletsRef = useRef(
    wallets.sort(sortWalletByBetMostToLeastBetAmount)
  );

  const sortedWallets = useMemo(() => {
    if (showNewWalletOrder) {
      previousWalletsRef.current = wallets.sort(
        sortWalletByBetMostToLeastBetAmount
      );
    }
    return previousWalletsRef.current;
  }, [wallets, showNewWalletOrder]);

  return (
    <CenterSpaced>
      {sortedWallets.map((wallet) => {
        const currentResult = bettingRound!.result?.playerResults.find(
          (r) => r.playerId === wallet.playerId
        );

        const betState = getBetState(
          bettingRound,
          wallet,
          revealResult,
          showNewWalletOrder
        );

        return (
          <CenteredCard
            key={wallet.playerId}
            // style={{
            //   borderColor:
            //     revealResult && currentResult
            //       ? currentResult.totalWinnings > 0
            //         ? COLORS.backgroundSuccess
            //         : COLORS.backgroundFailure
            //       : betState.state === "broke"
            //       ? COLORS.backgroundInactive
            //       : betState.state === "bet"
            //       ? COLORS.backgroundSuccess
            //       : "",
            // }}
          >
            <SubHeading>{names[wallet.playerId]}</SubHeading>
            <PlayerAvatar playerId={wallet.playerId} size="thumbnail" />
            <Heading>
              {currentResult && betState.state === "result-win" && (
                <>+{currentResult.totalWinnings}🍒</>
              )}
              {currentResult && betState.state === "result-lose" && (
                <>{currentResult.totalWinnings}🍒</>
              )}
              {betState.state === "waiting" && `${wallet.value}🍒`}
              {betState.state === "show-wallet" && `${wallet.value}🍒`}
              {betState.state === "broke" && "😩"}
              {betState.state === "bet" && "✅"}
            </Heading>
            {/* <CaptionText>
              {betState.state === "broke"
                ? "Broke"
                : currentBet && currentBet.betOptionId}
              {currentBet && <> ({currentBet.betValue})</>}
            </CaptionText> */}
          </CenteredCard>
        );
      })}
    </CenterSpaced>
  );
};
