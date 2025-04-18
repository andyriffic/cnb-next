import {
  MysteryBoxGame,
  MysteryBoxGameView,
} from "../../services/mystery-box/types";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { DebugMysteryBoxGame } from "./DebugMysteryBox";
import { MysteryBoxActivePlayers } from "./MysteryBoxActivePlayers";
import { MysteryBoxCurrentRoundUi } from "./MysteryBoxCurrentRoundUi";
import { MysteryBoxRoundHistory } from "./MysteryBoxRoundHistory";
import { useMysteryBoxGameState } from "./useMysteryBoxGameState";

type Props = {
  game: MysteryBoxGameView;
};

const View = ({ game }: Props) => {
  const gameState = useMysteryBoxGameState(game);

  return (
    <SpectatorPageLayout debug={<DebugMysteryBoxGame game={game} />}>
      <p>{game.id}</p>
      <div style={{ position: "relative" }}>
        <MysteryBoxCurrentRoundUi round={game.currentRound} />
        <MysteryBoxActivePlayers
          game={game}
          playerPosition={
            gameState.gameState !== "show-player-box-selections"
              ? "waiting"
              : "next-to-chosen-box"
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
