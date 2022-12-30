import { COLORS } from "../../colors";
import { usePlayerNames } from "../../providers/PlayerNamesProvider";
import {
  GroupPlayerBettingRound,
  PlayerWallet,
} from "../../services/betting/types";
import { CenteredCard, SubHeading, Heading, CaptionText } from "../Atoms";
import { CenterSpaced } from "../Layouts";
import { PlayerAvatar } from "../PlayerAvatar";

type BetState = "broke" | "waiting" | "bet";

const getBetState = (
  playerId: string,
  round: GroupPlayerBettingRound,
  wallet: PlayerWallet
): { state: BetState } => {
  if (wallet.value === 0) {
    return { state: "broke" };
  }

  const currentBet = round.playerBets.find(
    (b) => b.playerId === wallet.playerId
  );

  return { state: currentBet ? "bet" : "waiting" };
};

type Props = {
  wallets: PlayerWallet[];
  bettingRound: GroupPlayerBettingRound;
};

export const ViewerWaitingToBetList = ({
  wallets,
  bettingRound,
}: Props): JSX.Element => {
  const { names } = usePlayerNames();
  return (
    <CenterSpaced>
      {wallets.map((wallet) => {
        const currentBet = bettingRound.playerBets.find(
          (b) => b.playerId === wallet.playerId
        );
        const currentResult = bettingRound!.result?.playerResults.find(
          (r) => r.playerId === wallet.playerId
        );

        const betState = getBetState(wallet.playerId, bettingRound, wallet);

        return (
          <CenteredCard
            key={wallet.playerId}
            style={{
              borderColor: currentResult
                ? currentResult.totalWinnings > 0
                  ? COLORS.backgroundSuccess
                  : COLORS.backgroundFailure
                : betState.state === "broke"
                ? COLORS.backgroundInactive
                : betState.state === "bet"
                ? COLORS.backgroundSuccess
                : "",
            }}
          >
            <SubHeading>{names[wallet.playerId]}</SubHeading>
            <PlayerAvatar playerId={wallet.playerId} size="thumbnail" />
            <Heading>
              {currentResult && currentResult.totalWinnings}
              {!currentResult && betState.state === "broke" && "😩"}
              {!currentResult &&
                betState.state === "waiting" &&
                `${wallet.value}🍒`}
              {!currentResult && betState.state === "bet" && "✅"}
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
