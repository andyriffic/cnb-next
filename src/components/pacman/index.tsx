import { useRouter } from "next/router";
import styled from "styled-components";
import Link from "next/link";
import { Player } from "../../types/Player";
import { isClientSideFeatureEnabled } from "../../utils/feature";
import { Card, PrimaryButton } from "../Atoms";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { SplashContent } from "../SplashContent";
import { Coins } from "../Coins";
import { Board } from "./Board";
import { PacmanMovesInfo } from "./PacmanMovesInfo";
import { WinningPlayer } from "./WinningPlayer";
import { boardConfig } from "./boardConfig";
import { usePacMan } from "./hooks/usePacman";
import { usePacmanSound } from "./hooks/usePacmanSound";
import { usePlayerAutoMove } from "./hooks/usePlayerMoveTick";
import { useSyncData } from "./hooks/useSyncData";

const Container = styled.div`
  margin: 0 auto;
`;

type Props = {
  players: Player[];
  pacmanStartingIndex: number;
};

const saveDisabled = isClientSideFeatureEnabled("no-save");

const View = ({ players, pacmanStartingIndex }: Props) => {
  // const { triggerUpdate } = usePlayersProvider();
  const router = useRouter();
  const team = router.query.team as string;

  const pacManService = usePacMan(
    players,
    boardConfig,
    team,
    pacmanStartingIndex
  );
  usePacmanSound(pacManService.uiState);
  usePlayerAutoMove(pacManService);
  useSyncData(pacManService.uiState, saveDisabled);

  return (
    <SpectatorPageLayout scrollable={true}>
      <Container>
        <Board uiState={pacManService.uiState} />
      </Container>
      {pacManService.uiState.status === "game-over" && (
        <SplashContent>
          <Card>Game Over</Card>
        </SplashContent>
      )}
      {pacManService.uiState.status === "show-pacman-moves" && (
        <SplashContent
          onComplete={() => pacManService.setUiStatus("ready-to-move-pacman")}
        >
          <PacmanMovesInfo uiState={pacManService.uiState} />
        </SplashContent>
      )}
      {pacManService.uiState.status === "ready" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <PrimaryButton
            onClick={pacManService.startGame}
            disabled={pacManService.uiState.status !== "ready"}
          >
            Start Game
          </PrimaryButton>
          {/* <BoardFinalMatchup state={pacManService.uiState} /> */}
        </div>
      )}
      {pacManService.uiState.status === "game-over" && (
        <WinningPlayer
          winningPlayer={pacManService.uiState.allPacPlayers.find(
            (p) => p.finishPosition === 1
          )}
        />
      )}
      {pacManService.uiState.status === "game-over" && (
        <Link href="/coin-rankings">
          <div style={{ position: "absolute", top: 0, left: 0 }}>
            <Coins totalCoins={3} />
          </div>
        </Link>
      )}
    </SpectatorPageLayout>
  );
};

export default View;
