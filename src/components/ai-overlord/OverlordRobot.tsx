import Image from "next/future/image";
import styled from "styled-components";
import { AiOverlord } from "../../services/ai-overlord/types";
import { SpeechText } from "./SpeechText";

const RobotLayout = styled.div`
  position: relative;
`;

const RobotBody = styled.div`
  position: relative;
  width: 25vh;
  height: 50vh;
`;

const RobotSpeech = styled.div`
  position: absolute;
  width: 30vw;
  top: -20vh;
  right: 0;
`;

type Props = {
  overlord: AiOverlord;
};

export const OverlordRobot = ({ overlord }: Props) => {
  return (
    <RobotLayout>
      <RobotBody>
        <Image
          src="/images/ai-overlords/overlord-01.png"
          alt="Menacing robot"
          fill={true}
        />
      </RobotBody>
      <RobotSpeech>
        <SpeechText text={overlord.introduction} />
      </RobotSpeech>
    </RobotLayout>
  );
};
