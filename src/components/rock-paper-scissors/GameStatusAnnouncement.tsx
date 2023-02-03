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

const Container = styled.div``;

type Props = {
  groupBettingGame: GroupBettingGame;
  rpsGame: RPSSpectatorGameView;
  gameState: RpsGameState;
};

export function GameStatusAnnouncement({
  groupBettingGame,
  rpsGame,
  gameState,
}: Props) {
  const { getName } = usePlayerNames();

  const gameStatusText = useMemo(() => {
    const bettingPlayersRemaining = groupBettingGame.playerWallets.filter(
      (w) => w.value > 0
    );

    if (bettingPlayersRemaining.length === 1) {
      return `${getName(bettingPlayersRemaining[0]!.playerId)} wins!`;
    }

    if (bettingPlayersRemaining.length > 1) {
      return `${bettingPlayersRemaining.length} players remaining`;
    }

    const player1Id = rpsGame.playerIds[0];
    const player2Id = rpsGame.playerIds[1];

    const player1Score =
      rpsGame.scores.find((s) => s.playerId === player1Id)?.score || 0;
    const player2Score =
      rpsGame.scores.find((s) => s.playerId === player2Id)?.score || 0;

    if (player1Score === player2Score) {
      return "It's a draw";
    } else if (player1Score > player2Score) {
      return `${getName(player1Id)} wins!`;
    } else {
      return `${getName(player2Id)} wins!`;
    }

    return "Hello";
  }, [groupBettingGame, rpsGame, getName]);

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
