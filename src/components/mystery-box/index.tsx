import { useEffect } from "react";
import { useSocketIo } from "../../providers/SocketIoProvider";
import {
  MysteryBoxGame,
  MysteryBoxGameView,
} from "../../services/mystery-box/types";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { isClientSideFeatureEnabled } from "../../utils/feature";
import { DebugMysteryBoxGame } from "./DebugMysteryBox";
import { MysteryBoxActivePlayers } from "./MysteryBoxActivePlayers";
import { MysteryBoxCurrentRoundUi } from "./MysteryBoxCurrentRoundUi";
import { MysteryBoxRoundHistory } from "./MysteryBoxRoundHistory";
import { useMysteryBoxGameSound } from "./useMysteryBoxGameSound";
import {
  MysteryBoxGameState,
  useMysteryBoxGameState,
} from "./useMysteryBoxGameState";
import { GameOverResultsByRound } from "./GameOverResultsByRound";

type Props = {
  game: MysteryBoxGameView;
};

const View = ({ game }: Props) => {
  const { mysteryBox } = useSocketIo();
  const disableAutoNextRound = isClientSideFeatureEnabled("no-round-auto-next");
  const bombDropperFeatureEnabled = isClientSideFeatureEnabled("dropper");

  const gameState = useMysteryBoxGameState(game, bombDropperFeatureEnabled);
  useMysteryBoxGameSound(game, gameState.gameState);

  useEffect(() => {
    if (disableAutoNextRound) return;

    if (gameState.gameState === MysteryBoxGameState.ROUND_OVER) {
      mysteryBox.newRound(game.id);
    }
  }, [disableAutoNextRound, game.id, gameState.gameState, mysteryBox]);

  return (
    <SpectatorPageLayout debug={<DebugMysteryBoxGame game={game} />}>
      {/* <p>
        {game.id} - {MysteryBoxGameState[gameState.gameState]}
      </p> */}
      {disableAutoNextRound &&
        gameState.gameState === MysteryBoxGameState.ROUND_OVER && (
          <button type="button" onClick={() => mysteryBox.newRound(game.id)}>
            New Round
          </button>
        )}
      {gameState.gameState === MysteryBoxGameState.GAME_OVER && (
        <>
          <GameOverResultsByRound game={game} />
        </>
      )}
      {/* {game.gameOverSummary && <GameOverResults gameView={game} />} */}
      {gameState.gameState !== MysteryBoxGameState.GAME_OVER && (
        <>
          <div style={{ position: "relative" }}>
            <MysteryBoxCurrentRoundUi
              round={game.currentRound}
              gameState={gameState}
              bombDropperFeatureEnabled={bombDropperFeatureEnabled}
            />
            <MysteryBoxActivePlayers
              game={game}
              gameState={gameState}
              playerPosition={
                gameState.gameState >=
                MysteryBoxGameState.SHOW_PLAYER_BOX_SELECTIONS
                  ? "next-to-chosen-box"
                  : "waiting"
              }
            />
          </div>
          <div style={{ position: "absolute", bottom: "0" }}>
            <MysteryBoxRoundHistory game={game} />
          </div>
        </>
      )}
    </SpectatorPageLayout>
  );
};

export default View;
