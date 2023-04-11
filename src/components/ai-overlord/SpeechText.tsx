import styled from "styled-components";
import { useEffect } from "react";
import { TranslatedText } from "../../services/ai-overlord/types";
import { useDoOnce } from "../hooks/useDoOnce";

const SpeechBubble = styled.div`
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
  text: TranslatedText;
  onFinishedSpeaking?: () => void;
};

const speakLanguage = (
  language: string,
  text: string,
  onComplete?: (event: SpeechSynthesisEvent) => void
): void => {
  const synth = window.speechSynthesis;
  const voice = synth.getVoices().find((v) => v.lang === language);
  if (!voice) {
    return;
  }
  console.log("synth", synth.getVoices());
  const speech = new SpeechSynthesisUtterance(text);
  speech.rate = 1.1;
  speech.voice = voice;
  if (onComplete) {
    speech.onend = onComplete;
  }
  synth.speak(speech);
};

export const SpeechText = ({ text, onFinishedSpeaking }: Props) => {
  useDoOnce(() => {
    // speakLanguage("en-GB", text.english, () => {
    //   speakLanguage("zh-CN", text.chinese, onFinishedSpeaking);
    // });
    speakLanguage("en-GB", text.english, onFinishedSpeaking);
  });

  // useEffect(() => {
  //   const utterThis = new SpeechSynthesisUtterance(text.english);
  //   synth.speak(utterThis);
  // }, [text.english]);

  return (
    <SpeechBubble>
      <Text>🔊</Text>
      {/* <Text>{text.english}</Text> */}
      <Text>{text.chinese}</Text>
    </SpeechBubble>
  );
};
