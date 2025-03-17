import { MysteryBoxGame } from "../../services/mystery-box/types";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { DebugMysteryBoxGame } from "./DebugMysteryBox";
import { MysteryBoxCurrentRoundUi } from "./MysteryBoxCurrentRoundUi";

type Props = {
  game: MysteryBoxGame;
};

const View = ({ game }: Props) => {
  const round = game.rounds[game.rounds.length - 1];

  if (!round) {
    return <>No Round</>;
  }

  return (
    // https://codepen.io/RoyLee0702/pen/RwNgVya

    <SpectatorPageLayout debug={<DebugMysteryBoxGame game={game} />}>
      <p>{game.id}</p>
      <div>
        <MysteryBoxCurrentRoundUi round={round} />
      </div>
    </SpectatorPageLayout>
  );
};

export default View;
