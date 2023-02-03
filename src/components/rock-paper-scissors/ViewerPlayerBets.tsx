import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useTrail, animated, config } from "@react-spring/web";
import { COLORS } from "../../colors";
import {
  BettingOption,
  GroupPlayerBettingRound,
  PlayerWallet,
} from "../../services/betting/types";
import { FacingDirection, PlayerAvatar } from "../PlayerAvatar";

const Container = styled.div`
  /* width: 5vw; */
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  gap: 0.5rem;
`;

const Label = styled.div``;
const Value = styled.div`
  font-size: 3rem;
  font-weight: bold;
`;

const BetPill = styled.div`
  position: relative;
  font-size: 2rem;
  width: 3vw;
  overflow: visible;
`;

const Lives = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1rem;
`;

const hearts = (count: number) => new Array(count).fill("♥️").join();

type Props = {
  groupBettingRound: GroupPlayerBettingRound;
  wallets: PlayerWallet[];
  betId: string;
  direction: FacingDirection;
  explodeLosers: boolean;
};

export function ViewerPlayerBets({
  groupBettingRound,
  wallets,
  betId,
  direction,
  explodeLosers,
}: Props): JSX.Element {
  const [betOption] = useState(
    groupBettingRound.bettingOptions.find((o) => o.id === betId)!
  );
  const [players] = useState(
    groupBettingRound.playerBets.filter((bo) => bo.betOptionId === betId)
  );

  const displayedPlayers = useMemo(() => {
    return groupBettingRound.playerBets
      .filter((pb) => pb.betOptionId === betId)
      .filter((pb) =>
        explodeLosers
          ? wallets.find((w) => w.playerId === pb.playerId)?.value || 0 > 0
          : true
      );
  }, [groupBettingRound, betId, explodeLosers]);

  // const animationProps = useMemo(() => {
  //   const loser =
  //     explodeLosers &&
  //     groupBettingRound.result &&
  //     groupBettingRound.result.winningOptionId !== betId;
  //   return {
  //     opacity: loser ? 0 : 1,
  //     rotate: 0,
  //   };
  // }, [explodeLosers, groupBettingRound, betId]);

  // const trails = useTrail(players.length, {
  //   from: { opacity: 0, y: -30 },
  //   to: { opacity: animationProps.opacity, y: 0 },
  //   delay: 1,
  //   config: config.wobbly,
  // });

  return (
    <Container>
      {/* <Value>
        {betValue}/{totalBetValue}
      </Value> */}
      {displayedPlayers.map((player) => {
        const livesRemaining =
          wallets.find((w) => w.playerId === player.playerId)?.value || 0;
        return (
          <BetPill key={player.playerId}>
            <PlayerAvatar
              playerId={player.playerId}
              size="thumbnail"
              facing={direction}
            />
            {/* {explodeLosers && <Lives>{hearts(livesRemaining)}</Lives>} */}
          </BetPill>
        );
      })}
    </Container>
  );
}
