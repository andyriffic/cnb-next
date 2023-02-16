import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Card, Heading } from "../Atoms";
import { useSound } from "../hooks/useSound";
import { PlayerAvatar } from "../PlayerAvatar";
import { SplashContent } from "../SplashContent";
import { RpsGameState } from "./hooks/useGameState";
import { WinningConditions } from "./hooks/useGameWinningConditions";

type WinningDisplay = {
  title: string;
  playerIds: string[];
};

const Container = styled.div``;

const PlayerContainer = styled.div`
  display: flex;
  gap: 0.4rem;
  justify-content: center;
`;

type Props = {
  winningConditions: WinningConditions | undefined;
  gameState: RpsGameState;
};

export function GameStatusAnnouncement({
  winningConditions,
  gameState,
}: Props) {
  const { play } = useSound();

  useEffect(() => {
    if (gameState !== RpsGameState.SHOW_GAME_STATUS) {
      return;
    }

    if (
      !!winningConditions?.spectatorWinnerPlayerId ||
      !!winningConditions?.playerWinnerPlayerId
    ) {
      play("rps-definite-winner");
    } else if (winningConditions?.couldWinNextMovePlayerIds.length || 0 > 0) {
      play("rps-could-win-next-round");
    } else if (winningConditions?.frontRunnerPlayerIds.length || 0 > 0) {
      play("rps-front-runners");
    }
  }, [play, gameState, winningConditions]);

  const gameStatusDisplay = useMemo<WinningDisplay>(() => {
    if (!winningConditions) {
      return { title: "🤷‍♂️", playerIds: [] };
    }

    if (winningConditions.spectatorWinnerPlayerId) {
      return {
        title: "Winner!",
        playerIds: [winningConditions.spectatorWinnerPlayerId],
      };
    }

    if (winningConditions.playerWinnerPlayerId) {
      return {
        title: "Winner!",
        playerIds: [winningConditions.playerWinnerPlayerId],
      };
    }

    if (winningConditions.couldWinNextMovePlayerIds.length > 0) {
      return {
        title: "Could win next round 🙀",
        playerIds: [...winningConditions.couldWinNextMovePlayerIds],
      };
    }

    if (winningConditions.frontRunnerPlayerIds.length > 0) {
      return {
        title: "Front runners",
        playerIds: [...winningConditions.frontRunnerPlayerIds],
      };
    }

    return { title: "No winner 😅", playerIds: [] };
  }, [winningConditions]);

  return (
    <Container>
      {gameState >= RpsGameState.SHOW_GAME_STATUS && (
        <SplashContent>
          <Card>
            <Heading>{gameStatusDisplay.title}</Heading>
            {gameStatusDisplay.playerIds.length > 0 && (
              <PlayerContainer>
                {gameStatusDisplay.playerIds.map((pid) => (
                  <PlayerAvatar key={pid} playerId={pid} size="thumbnail" />
                ))}
              </PlayerContainer>
            )}
          </Card>
        </SplashContent>
      )}
    </Container>
  );
}
