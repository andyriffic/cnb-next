import { MysteryBoxGame } from "../../services/mystery-box/types";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { DebugMysteryBoxGame } from "./DebugMysteryBox";

type Props = {
  game: MysteryBoxGame;
};

const View = ({ game }: Props) => {
  return (
    <SpectatorPageLayout debug={<DebugMysteryBoxGame game={game} />}>
      <p>{game.id}</p>
    </SpectatorPageLayout>
  );
};

export default View;
