import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { TranslatedText } from "../../services/ai-overlord/types";
import { retryFunction } from "../../utils/retry";
import { ChineseText } from "../ChineseText";
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
  retryFunction(
    () => Promise.resolve(synth.getVoices()),
    5,
    (voices) => voices.length > 0,
    300
  ).then((voices) => {
    const voice = voices.find((v) => v.lang === language);
    if (!voice) {
      console.info("no voice found");
      return;
    }
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;
    speech.voice = voice;
    if (onComplete) {
      speech.onend = onComplete;
    }
    synth.speak(speech);
  });
};

type SpeechStatus = "speaking-english" | "speaking-chinese" | "finished";

export const SpeechText = ({ text, onFinishedSpeaking }: Props) => {
  const startedSpeaking = useRef(false);
  const [speechStatus, setSpeechStatus] =
    useState<SpeechStatus>("speaking-english");

  useEffect(() => {
    if (speechStatus === "speaking-english" && !startedSpeaking.current) {
      startedSpeaking.current = true;
      speakLanguage("en-GB", text.english, () => {
        if (window.location.href.includes("chinese=true")) {
          setSpeechStatus("speaking-chinese");
        } else {
          setSpeechStatus("finished");
          onFinishedSpeaking?.();
        }
      });
    }
  }, [onFinishedSpeaking, speechStatus, text.english]);

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
      {/* {speechStatus === "speaking-chinese" || speechStatus === "finished" ? ( */}
      {true === true ? (
        <Appear animation="text-focus-in">
          <Text>{text.english}</Text>
        </Appear>
      ) : (
        <Text>🔊 *English* 🔊</Text>
      )}
      {speechStatus === "speaking-english" || speechStatus === "finished" ? (
        <Appear animation="text-focus-in">
          <Text>
            <ChineseText>{text.chinese}</ChineseText>
          </Text>
        </Appear>
      ) : (
        <Text>🔊 *Chinese* 🔊</Text>
      )}
    </SpeechBubble>
  );
};
