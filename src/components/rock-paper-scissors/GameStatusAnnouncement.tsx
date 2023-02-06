import { useMemo } from "react";
import styled from "styled-components";
import { usePlayerNames } from "../../providers/PlayerNamesProvider";
import {
  GroupBettingGame,
  GroupPlayerBettingRound,
} from "../../services/betting/types";
import { RPSSpectatorGameView } from "../../services/rock-paper-scissors/types";
import { Attention } from "../animations/Attention";
import { Card, Heading, SubHeading } from "../Atoms";
import { BetTotal } from "./BetTotal";
import { RpsGameState } from "./hooks/useGameState";
import { WinningConditions } from "./hooks/useGameWinningConditions";

const Container = styled.div``;

type Props = {
  winningConditions: WinningConditions | undefined;
  gameState: RpsGameState;
};

const SPECTATOR_TARGET_SCORE = 4;

export function GameStatusAnnouncement({
  winningConditions,
  gameState,
}: Props) {
  const { getName } = usePlayerNames();

  const gameStatusText = useMemo(() => {
    if (!winningConditions) {
      return "🤷‍♂️";
    }

    if (winningConditions.spectatorWinnerPlayerId) {
      return `${getName(winningConditions.spectatorWinnerPlayerId)} wins!`;
    }

    if (winningConditions.playerWinnerPlayerId) {
      return `${getName(winningConditions.playerWinnerPlayerId)} wins!`;
    }

    if (winningConditions.couldWinNextMovePlayerIds.length > 0) {
      return `Could win next round: ${winningConditions.couldWinNextMovePlayerIds
        .map(getName)
        .join(", ")}`;
    }

    if (winningConditions.frontRunnerPlayerIds.length > 0) {
      return `Front runners: ${winningConditions.frontRunnerPlayerIds
        .map(getName)
        .join(", ")}`;
    }
  }, [winningConditions, getName]);

  return (
    <Container>
      {gameState >= RpsGameState.FINISHED && (
        <Card>
          <Heading>
            <Attention animate={gameState === RpsGameState.SHOW_GAME_RESULT}>
              {gameStatusText}
            </Attention>
          </Heading>
        </Card>
      )}
    </Container>
  );
}
