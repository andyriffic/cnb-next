import { useMemo } from "react";
import styled from "styled-components";
import { GroupPlayerBettingRound } from "../services/betting/types";
import { Attention } from "./animations/Attention";
import { SubHeading } from "./Atoms";
import { BetTotal } from "./rock-paper-scissors/BetTotal";
import { RpsGameState } from "./rock-paper-scissors/hooks/useGameState";

const Container = styled.div``;

type Props = {
  currentBettingRound: GroupPlayerBettingRound;
  show: boolean;
  isDraw: boolean;
  gameState: RpsGameState;
};

export function DrawBetTotal({
  show,
  currentBettingRound,
  gameState,
  isDraw,
}: Props) {
  const totalDrawAmount = useMemo(() => {
    return currentBettingRound.playerBets
      .filter((pb) => pb.betOptionId === "draw")
      .map((pb) => pb.betValue)
      .reduce((total, value) => total + value, 0);
  }, [currentBettingRound]);

  return show ? (
    <Container>
      {gameState >= RpsGameState.SHOW_GAME_RESULT && isDraw && (
        <SubHeading style={{ position: "absolute" }}>
          <Attention animate={gameState === RpsGameState.SHOW_GAME_RESULT}>
            Draw
          </Attention>
        </SubHeading>
      )}

      <BetTotal betValue={totalDrawAmount} totalBetValue={0} />
    </Container>
  ) : null;
}
