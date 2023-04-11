import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { TranslatedText } from "../../services/ai-overlord/types";
import { useDoOnce } from "../hooks/useDoOnce";
import { Appear } from "../animations/Appear";

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
  speech.rate = 1;
  speech.voice = voice;
  if (onComplete) {
    speech.onend = onComplete;
  }
  synth.speak(speech);
};

type SpeechStatus = "speaking-english" | "speaking-chinese" | "finished";

export const SpeechText = ({ text, onFinishedSpeaking }: Props) => {
  const startedSpeaking = useRef(false);
  const [speechStatus, setSpeechStatus] =
    useState<SpeechStatus>("speaking-english");

  // useEffect(() => {
  //   speakLanguage("en-GB", text.english, () => {
  //     setSpeechStatus("speaking-chinese");
  //     speakLanguage("zh-CN", text.chinese, () => {
  //       setSpeechStatus("finished");
  //       onFinishedSpeaking?.();
  //     });
  //   });
  // }, []);

  useEffect(() => {
    if (speechStatus === "speaking-english" && !startedSpeaking.current) {
      startedSpeaking.current = true;
      speakLanguage("en-GB", text.english, () => {
        setSpeechStatus("speaking-chinese");
      });
    }
  }, [speechStatus, text.english]);

  useEffect(() => {
    if (speechStatus === "speaking-chinese") {
      speakLanguage("zh-CN", text.chinese, () => {
        setSpeechStatus("finished");
        onFinishedSpeaking?.();
      });
    }
  }, [onFinishedSpeaking, speechStatus, text.chinese]);

  return (
    <SpeechBubble>
      {speechStatus === "speaking-chinese" || speechStatus === "finished" ? (
        <Appear animation="text-focus-in">
          <Text>{text.english}</Text>
        </Appear>
      ) : (
        <Text>🔊 *English* 🔊</Text>
      )}
      {speechStatus === "speaking-english" || speechStatus === "finished" ? (
        <Appear animation="text-focus-in">
          <Text>{text.chinese}</Text>
        </Appear>
      ) : (
        <Text>🔊 *Chinese* 🔊</Text>
      )}
    </SpeechBubble>
  );
};
