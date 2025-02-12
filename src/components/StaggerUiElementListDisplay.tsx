import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSound } from "./hooks/useSound";
import { SoundName } from "./hooks/useSound/types";

const Container = styled.div`
  // display: flex;
`;

type Props = {
  uiElements: JSX.Element[];
  displayMilliseconds?: number;
  onAllItemsDisplayed?: () => void;
  soundKey?: SoundName;
};

export function StaggerUiElementListDisplay({
  uiElements,
  displayMilliseconds = 600,
  onAllItemsDisplayed,
  soundKey,
}: Props) {
  const [revealIndex, setRevealIndex] = useState(-1);
  const callbackFired = useRef(false);
  const { play } = useSound();

  useEffect(() => {
    if (revealIndex >= uiElements.length) {
      if (!callbackFired.current) {
        callbackFired.current = true;
        onAllItemsDisplayed && onAllItemsDisplayed();
      }
      return;
    }

    const interval = setInterval(() => {
      console.log("interval", revealIndex);
      if (
        soundKey &&
        revealIndex + 1 >= 0 &&
        revealIndex + 1 < uiElements.length
      ) {
        play(soundKey);
      }

      setRevealIndex((revealIndex) => revealIndex + 1);
    }, displayMilliseconds);
    return () => clearInterval(interval);
  }, [
    displayMilliseconds,
    onAllItemsDisplayed,
    play,
    revealIndex,
    soundKey,
    uiElements.length,
  ]);

  useEffect(() => {}, [play, revealIndex]);

  return <>{uiElements.filter((_, i) => i <= revealIndex)}</>;
}
