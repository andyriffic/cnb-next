import Image from "next/future/image";
import styled from "styled-components";
import { PrimaryButton } from "../Atoms";

const Layout = styled.div`
  position: relative;
`;

const SizedImage = styled.div`
  position: relative;
  width: 25vh;
  height: 50vh;
`;

const SpeechBubble = styled.div`
  position: absolute;
  top: -10vh;
  background: white;
  border-radius: 1rem;
  border: 2px solid black;
  padding: 1rem;
`;

const Text = styled.p`
  font-size: 1.3rem;
  padding: 0.5rem;
`;

type Props = {
  isInitialised: boolean;
  onAiUnleashed: () => void;
};

export const RobotCreating = ({ isInitialised, onAiUnleashed }: Props) => {
  return (
    <Layout>
      <SizedImage>
        <Image
          src="/images/ai-overlords/duck-coding.gif"
          alt="A duck wearing glasses types on a laptop computer"
          fill={true}
        />
      </SizedImage>
      <SpeechBubble>
        <Text>
          An IT worker is experimenting with AI, not knowing what terror it is
          about to unleash to the world!
        </Text>
      </SpeechBubble>
      <div style={{ position: "absolute", bottom: 0 }}>
        <PrimaryButton onClick={onAiUnleashed} disabled={!isInitialised}>
          {isInitialised ? "Deploy AI Model" : "Writing code..."}
        </PrimaryButton>
      </div>
    </Layout>
  );
};
