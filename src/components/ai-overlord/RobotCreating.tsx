import { type } from "os";
import Image from "next/image";
import styled from "styled-components";
import { useEffect } from "react";
import { PrimaryButton } from "../Atoms";
import { useSound } from "../hooks/useSound";

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
  top: -14vh;
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
  const { loop } = useSound();

  useEffect(() => {
    const typingSound = loop("ai-typing");
    typingSound.play();

    return () => {
      typingSound.stop();
    };
  }, [loop]);

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
          A diligent graduate developer immerses themselves in their laptop,
          meticulously crafting an AI-powered rock-paper-scissors robot with
          precision.
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
