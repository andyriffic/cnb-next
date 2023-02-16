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
import { Appear } from "../animations/Appear";
import { useSound } from "../hooks/useSound";
import { NumericValue } from "../NumericValue";
import { useGameState } from "./hooks/useGameState";

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
  const { play } = useSound();
  const displayedPlayers = useMemo(() => {
    return groupBettingRound.playerBets.filter(
      (pb) => pb.betOptionId === betId
    );
    // .filter(() =>
    //   explodeLosers
    //     ? !!groupBettingRound.result &&
    //       groupBettingRound.result.winningOptionId === betId
    //     : true
    // );
  }, [groupBettingRound, betId]);

  const [displayedPlayerIndex, setDisplayedPlayerIndex] = useState(0);
  const [betOption] = useState(
    groupBettingRound.bettingOptions.find((o) => o.id === betId)!
  );
  const [players] = useState(
    groupBettingRound.playerBets.filter((bo) => bo.betOptionId === betId)
  );

  useEffect(() => {
    if (displayedPlayerIndex < displayedPlayers.length) {
      play("rps-spectator-choice-reveal");
      setTimeout(() => {
        setDisplayedPlayerIndex(displayedPlayerIndex + 1);
      }, 800);
    }
  }, [displayedPlayerIndex, displayedPlayers, play]);

  return (
    <Container>
      {/* <Value>
        {betValue}/{totalBetValue}
      </Value> */}
      {displayedPlayers.map((player, i) => {
        const livesRemaining =
          wallets.find((w) => w.playerId === player.playerId)?.value || 0;

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
                facing={direction}
              />
              {explodeLosers && (
                <Lives>
                  <NumericValue>{livesRemaining}</NumericValue>{" "}
                </Lives>
              )}
              {/* {explodeLosers && <Lives>{hearts(livesRemaining)}</Lives>} */}
            </BetPill>
          </Appear>
        );
      })}
    </Container>
  );
}
