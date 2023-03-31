import { AiOverlordGame } from "../../services/ai-overlord/types";
import { Heading } from "../Atoms";
import { CenterSpaced } from "../Layouts";
import { Positioned } from "../Positioned";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { OverlordCurrentOpponent } from "./OverlordCurrentOpponent";
import { OverlordOpponents } from "./OverlordOpponents";
import { OverlordRobot } from "./OverlordRobot";

type Props = {
  aiOverlordGame: AiOverlordGame;
};

const View = ({ aiOverlordGame }: Props) => {
  return (
    <SpectatorPageLayout>
      <CenterSpaced>
        <Heading>AI Overlord!</Heading>
      </CenterSpaced>

      <Positioned absolute={{ rightPercent: 10, bottomPercent: 10 }}>
        <OverlordRobot overlord={aiOverlordGame.aiOverlord} />
      </Positioned>
      <Positioned absolute={{ leftPercent: 10, bottomPercent: 10 }}>
        {/* <OverlordOpponents aiOverlordGame={aiOverlordGame} /> */}
        <OverlordCurrentOpponent aiOverlordGame={aiOverlordGame} />
      </Positioned>
    </SpectatorPageLayout>
  );
};

export default View;
