import { animated, config, useTransition } from "@react-spring/web";
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
import { RpsGameState } from "./hooks/useGameState";

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
  removeBustedPlayers: boolean;
};

const WIDTH_PX = 100;

export const ViewerWaitingToBetList = ({
  wallets,
  bettingRound,
  revealResult,
  removeBustedPlayers,
}: Props): JSX.Element => {
  const { names } = usePlayerNames();
  const previousWalletsRef = useRef(
    wallets.sort(sortWalletByBetMostToLeastBetAmount)
  );

  const waitingPlayerWallets = useMemo(() => {
    return wallets
      .filter((w) => w.value > 0)
      .filter(
        (w) => !bettingRound.playerBets.find((b) => b.playerId === w.playerId)
      );
  }, [wallets, bettingRound]);

  const transitions = useTransition(
    waitingPlayerWallets.map((w, i) => ({ ...w, x: i * WIDTH_PX })),
    {
      key: (w: PlayerWallet) => w.playerId,
      from: { position: "absolute", opacity: 0, top: -50 },
      leave: { opacity: 0, top: 50 },
      enter: ({ x }) => ({ x, opacity: 1, top: 0 }),
      update: ({ x }) => ({ x }),
      config: config.molasses,
    }
  );

  return (
    <div style={{ position: "relative", width: wallets.length * WIDTH_PX }}>
      {transitions((style, wallet, t, index) => {
        const currentResult = bettingRound!.result?.playerResults.find(
          (r) => r.playerId === wallet.playerId
        );

        // const betState = getBetState(
        //   bettingRound,
        //   wallet,
        //   revealResult,
        // );

        return (
          <animated.div
            style={{ zIndex: waitingPlayerWallets.length - index, ...style }}
          >
            <div key={wallet.playerId}>
              {/* <SubHeading>{names[wallet.playerId]}</SubHeading> */}
              <PlayerAvatar playerId={wallet.playerId} size="thumbnail" />
            </div>
          </animated.div>
        );
      })}
      {/* {sortedWallets.map((wallet) => {
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
              style={{ opacity: betState.state === "waiting" ? 0.65 : 1 }}
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
            </CenteredCard>
          );
        })} */}
    </div>
  );
};
