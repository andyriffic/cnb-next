import {
  MysteryBoxGame,
  MysteryBoxGameView,
} from "../../services/mystery-box/types";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { DebugMysteryBoxGame } from "./DebugMysteryBox";
import { MysteryBoxActivePlayers } from "./MysteryBoxActivePlayers";
import { MysteryBoxCurrentRoundUi } from "./MysteryBoxCurrentRoundUi";

type Props = {
  game: MysteryBoxGameView;
};

const View = ({ game }: Props) => {
  return (
    <SpectatorPageLayout debug={<DebugMysteryBoxGame game={game} />}>
      <p>{game.id}</p>
      <div style={{ position: "relative" }}>
        <MysteryBoxCurrentRoundUi round={game.currentRound} />
        {/* <MysteryBoxRoundHistory game={game} /> */}
        <MysteryBoxActivePlayers game={game} playerPosition="waiting" />
      </div>
    </SpectatorPageLayout>
  );
};

export default View;
