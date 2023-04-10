import { useEffect } from "react";
import { AiOverlordGame } from "../../services/ai-overlord/types";
import { Heading } from "../Atoms";
import { CenterSpaced } from "../Layouts";
import { Positioned } from "../Positioned";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { useSound } from "../hooks/useSound";
import { useAiOverlordGame } from "../../providers/SocketIoProvider/useAiOverlord";
import { OverlordCurrentOpponent } from "./OverlordCurrentOpponent";
import { OverlordOpponents } from "./OverlordOpponents";
import { OverlordRobot } from "./OverlordRobot";
import { RobotMessage } from "./RobotMessage";

type Props = {
  aiOverlordGame: AiOverlordGame;
};

const View = ({ aiOverlordGame }: Props) => {
  const { isThinking } = useAiOverlordGame(aiOverlordGame.gameId);
  const { loop } = useSound();

  useEffect(() => {
    if (isThinking) {
      const thinkingSound = loop("ai-thinking");
      thinkingSound.play();
      return () => {
        thinkingSound.stop();
      };
    }
  }, [isThinking, loop]);

  return (
    <SpectatorPageLayout>
      <CenterSpaced>
        <Heading>AI Overlord!</Heading>
      </CenterSpaced>

      <Positioned absolute={{ rightPercent: 10, bottomPercent: 10 }}>
        <OverlordRobot aiOverlordGame={aiOverlordGame} />
      </Positioned>
      <Positioned absolute={{ leftPercent: 10, bottomPercent: 10 }}>
        <OverlordCurrentOpponent aiOverlordGame={aiOverlordGame} />
      </Positioned>
      <Positioned absolute={{ leftPercent: 1, topPercent: 1 }}>
        <OverlordOpponents aiOverlordGame={aiOverlordGame} />
      </Positioned>
      <Positioned absolute={{ rightPercent: 1, topPercent: 1 }}>
        <RobotMessage />
      </Positioned>
    </SpectatorPageLayout>
  );
};

export default View;
