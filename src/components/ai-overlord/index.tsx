import { useEffect, useState } from "react";
import { useAiOverlordGame } from "../../providers/SocketIoProvider/useAiOverlord";
import { AiOverlordGame } from "../../services/ai-overlord/types";
import { Heading } from "../Atoms";
import { CenterSpaced } from "../Layouts";
import { Positioned } from "../Positioned";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { useSound } from "../hooks/useSound";
import { DebugAiOverlordGame } from "./DebugAiOverlordGame";
import { OverlordCurrentOpponent } from "./OverlordCurrentOpponent";
import { OverlordWaitingOpponents } from "./OverlordWaitingOpponents";
import { OverlordRobot } from "./OverlordRobot";
import { RobotMessage } from "./RobotMessage";
import { useAiOverlordGameView } from "./hooks/useAiOverlordGameView";
import { OverlordFinishedOpponents } from "./OverlordFinishedOpponents";

type Props = {
  aiOverlordGame: AiOverlordGame;
};

const View = ({ aiOverlordGame }: Props) => {
  const gameView = useAiOverlordGameView(aiOverlordGame);
  const [gameCanStart, setGameCanStart] = useState(true); // For voice synthesis, the page needs interacting with first
  const { isThinking } = useAiOverlordGame(aiOverlordGame.gameId);
  const { loop, play } = useSound();

  // useEffect(() => {
  //   console.log("speechSynthesis registering...");
  //   const voices = speechSynthesis.getVoices();
  //   if (voices.length === 0) {
  //     setTimeout(() => {
  //       window.speechSynthesis.onvoiceschanged = () => {
  //         console.log("voiceschanged event");
  //         setGameCanStart(true);
  //       };
  //     }, 500);
  //   } else {
  //     console.log("speechSynthesis initialised");
  //     setGameCanStart(true);
  //   }
  // }, []);

  useEffect(() => {
    if (isThinking) {
      const thinkingSound = loop("ai-thinking");
      thinkingSound.play();
      return () => {
        thinkingSound.stop();
      };
    } else {
      // play("ai-speaking");
    }
  }, [isThinking, loop, play]);

  return (
    <SpectatorPageLayout debug={<DebugAiOverlordGame gameView={gameView} />}>
      <CenterSpaced>
        <Heading>AI Overlord!</Heading>
      </CenterSpaced>

      <Positioned absolute={{ rightPercent: 10, bottomPercent: 10 }}>
        <OverlordRobot
          aiOverlordGame={aiOverlordGame}
          gameCanStart={gameCanStart}
          onRobotTurnedOn={() => setGameCanStart(true)}
        />
      </Positioned>
      <Positioned absolute={{ leftPercent: 10, bottomPercent: 10 }}>
        <OverlordCurrentOpponent aiOverlordGame={aiOverlordGame} />
      </Positioned>
      <Positioned absolute={{ leftPercent: 1, topPercent: 1 }}>
        <OverlordWaitingOpponents aiOverlordGame={aiOverlordGame} />
      </Positioned>
      <Positioned absolute={{ rightPercent: 1, topPercent: 1 }}>
        <OverlordFinishedOpponents aiOverlordGame={aiOverlordGame} />
      </Positioned>
      <Positioned absolute={{ rightPercent: 1, topPercent: 1 }}>
        <RobotMessage />
      </Positioned>
    </SpectatorPageLayout>
  );
};

export default View;
