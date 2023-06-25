import styled from "styled-components";
import { Player } from "../../types/Player";
import { PrimaryButton } from "../Atoms";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { SplashContent } from "../SplashContent";
import { Board } from "./Board";
import { boardConfig } from "./boardConfig";
import { usePacMan } from "./hooks/usePacman";
import { usePacmanSound } from "./hooks/usePacmanSound";
import { usePlayerAutoMove } from "./hooks/usePlayerMoveTick";

const Container = styled.div`
  margin: 0 auto;
`;

type Props = {
  players: Player[];
};

// const saveDisabled = isFeatureEnabled("no-save");

const View = ({ players }: Props) => {
  // const { triggerUpdate } = usePlayersProvider();
  const pacManService = usePacMan(players, boardConfig);
  usePacmanSound(pacManService.uiState);
  usePlayerAutoMove(pacManService);

  // useEffect(() => {
  //   triggerUpdate();
  // }, []);

  return (
    <SpectatorPageLayout scrollable={true}>
      <Container>
        <Board uiState={pacManService.uiState} />
      </Container>
      {pacManService.uiState.status === "game-over" && (
        <SplashContent>Game Over</SplashContent>
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
    </SpectatorPageLayout>
  );
};

export default View;
