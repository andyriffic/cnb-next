import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { COLORS } from "../../colors";
import {
  GroupPlayerBettingRound,
  PlayerWallet,
} from "../../services/betting/types";
import { Appear } from "../animations/Appear";
import { useSound } from "../hooks/useSound";
import { NumericValue } from "../NumericValue";
import { FacingDirection, PlayerAvatar } from "../PlayerAvatar";
import { WinningConditions } from "./hooks/useGameWinningConditions";

const Container = styled.div`
  /* width: 5vw; */
  display: flex;
  align-items: center;
  flex-direction: row;
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
  /* overflow: visible; */
`;

const Lives = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  /* transform: translateX(-50%); */
  font-size: 1rem;
  background: white;
  padding: 0.2rem 0.4rem;
  border-radius: 0.2rem;
  border: 2px solid ${COLORS.borderPrimary};
  z-index: 1;
`;

const Hot = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  /* transform: translateX(-50%); */
  font-size: 1.3rem;
`;

export const PLAYER_BET_ANIMATION_MS = 400;

type Props = {
  groupBettingRound: GroupPlayerBettingRound;
  wallets: PlayerWallet[];
  betId: string;
  direction: FacingDirection;
  explodeLosers: boolean;
  winningConditions: WinningConditions | undefined;
};

export function ViewerPlayerBets({
  groupBettingRound,
  wallets,
  betId,
  direction,
  explodeLosers,
  winningConditions,
}: Props): JSX.Element {
  const { play } = useSound();
  const displayedPlayers = useMemo(() => {
    return groupBettingRound.playerBets
      .filter((pb) => pb.betOptionId === betId)
      .filter(() =>
        explodeLosers
          ? !!groupBettingRound.result &&
            groupBettingRound.result.winningOptionId === betId
          : true
      );
  }, [groupBettingRound, betId, explodeLosers]);

  const [displayedPlayerIndex, setDisplayedPlayerIndex] = useState(0);
  // const [betOption] = useState(
  //   groupBettingRound.bettingOptions.find((o) => o.id === betId)!
  // );
  // const [players] = useState(
  //   groupBettingRound.playerBets.filter((bo) => bo.betOptionId === betId)
  // );

  useEffect(() => {
    if (displayedPlayerIndex < displayedPlayers.length) {
      play("rps-spectator-choice-reveal");
      setTimeout(() => {
        setDisplayedPlayerIndex(displayedPlayerIndex + 1);
      }, PLAYER_BET_ANIMATION_MS);
    }
  }, [displayedPlayerIndex, displayedPlayers, play]);

  return (
    <Container>
      {/* <Value>
        {betValue}/{totalBetValue}
      </Value> */}
      {displayedPlayers.map((player, i) => {
        const livesRemaining =
          wallets.find((w) => w.player.id === player.playerId)?.value || 0;

        const choseCorrectly =
          !!groupBettingRound.result &&
          groupBettingRound.result.winningOptionId === betId;

        return (
          <Appear
            key={player.playerId}
            show={i <= displayedPlayerIndex}
            animation="roll-in-left"
          >
            <BetPill
              style={{
                opacity: explodeLosers ? (choseCorrectly ? 1 : 0.7) : 1,
              }}
            >
              <PlayerAvatar
                playerId={player.playerId}
                size="thumbnail"
                // facing={direction}
              />
              {explodeLosers && (
                <Lives>
                  <NumericValue>{livesRemaining}</NumericValue>
                </Lives>
              )}
              {/* {winningConditions?.hotPlayerIds.includes(player.playerId) && (
                <Hot>🔥</Hot>
              )} */}
              {/* {explodeLosers && <Lives>{hearts(livesRemaining)}</Lives>} */}
            </BetPill>
          </Appear>
        );
      })}
    </Container>
  );
}
