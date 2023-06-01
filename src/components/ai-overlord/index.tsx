import { useEffect, useState } from "react";
import styled from "styled-components";
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

const Background = styled.div`
  background: no-repeat url("/images/ai-overlords/background-robot-lab-01.png")
    center center;
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  /* width: 100vw;
  height: 100vh; */
`;

type Props = {
  aiOverlordGame: AiOverlordGame;
};

const View = ({ aiOverlordGame }: Props) => {
  const gameView = useAiOverlordGameView(aiOverlordGame);
  const { isThinking } = useAiOverlordGame(aiOverlordGame.gameId);
  const [robotSpeaking, setRobotSpeaking] = useState(false);
  const { loop, play } = useSound();

  useEffect(() => {
    if (isThinking) {
      const thinkingSound = loop("ai-thinking");
      thinkingSound.play();
      return () => {
        thinkingSound.stop();
      };
    }
  }, [isThinking, loop, play]);

  return (
    <SpectatorPageLayout debug={<DebugAiOverlordGame gameView={gameView} />}>
      {/* <Background /> */}

      {/* <div style={{ position: "relative", display: "flex" }}> */}
      <CenterSpaced>
        <Heading>AI Overlord!</Heading>
      </CenterSpaced>

      <Positioned absolute={{ rightPercent: 10, bottomPercent: 10 }}>
        <OverlordRobot aiOverlordGame={aiOverlordGame} gameView={gameView} />
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
      {/* </div> */}
    </SpectatorPageLayout>
  );
};

export default View;
