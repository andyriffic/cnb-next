import {
  MysteryBoxGame,
  MysteryBoxGameView,
} from "../../services/mystery-box/types";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { DebugMysteryBoxGame } from "./DebugMysteryBox";
import { MysteryBoxActivePlayers } from "./MysteryBoxActivePlayers";
import { MysteryBoxCurrentRoundUi } from "./MysteryBoxCurrentRoundUi";
import { MysteryBoxRoundHistory } from "./MysteryBoxRoundHistory";
import {
  MysteryBoxGameState,
  useMysteryBoxGameState,
} from "./useMysteryBoxGameState";

type Props = {
  game: MysteryBoxGameView;
};

const View = ({ game }: Props) => {
  const gameState = useMysteryBoxGameState(game);

  return (
    <SpectatorPageLayout debug={<DebugMysteryBoxGame game={game} />}>
      <p>
        {game.id} - {MysteryBoxGameState[gameState.gameState]}
      </p>
      {game.gameOverSummary && (
        <p>GAME OVER! {game.gameOverSummary.outrightWinnerPlayerId}</p>
      )}
      <div style={{ position: "relative" }}>
        <MysteryBoxCurrentRoundUi
          round={game.currentRound}
          gameState={gameState}
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
      <div>
        <MysteryBoxRoundHistory game={game} />
      </div>
    </SpectatorPageLayout>
  );
};

export default View;
