import { MysteryBoxGame } from "../../services/mystery-box/types";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { DebugMysteryBoxGame } from "./DebugMysteryBox";
import { MysteryBoxCurrentRoundUi } from "./MysteryBoxCurrentRoundUi";
import { MysteryBoxRoundHistory } from "./MysteryBoxRoundHistory";

type Props = {
  game: MysteryBoxGame;
};

const View = ({ game }: Props) => {
  const round = game.rounds[game.rounds.length - 1];

  if (!round) {
    return <>No Round</>;
  }

  return (
    <SpectatorPageLayout debug={<DebugMysteryBoxGame game={game} />}>
      <p>{game.id}</p>
      <div>
        <MysteryBoxCurrentRoundUi round={round} />
        {/* <MysteryBoxRoundHistory game={game} /> */}
      </div>
    </SpectatorPageLayout>
  );
};

export default View;
