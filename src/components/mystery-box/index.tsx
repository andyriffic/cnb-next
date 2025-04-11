import { MysteryBoxGame } from "../../services/mystery-box/types";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { DebugMysteryBoxGame } from "./DebugMysteryBox";
import { MysteryBoxActivePlayers } from "./MysteryBoxActivePlayers";
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
      <div style={{ position: "relative" }}>
        <MysteryBoxCurrentRoundUi round={round} />
        {/* <MysteryBoxRoundHistory game={game} /> */}
        <MysteryBoxActivePlayers game={game} />
      </div>
    </SpectatorPageLayout>
  );
};

export default View;
