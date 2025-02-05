import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  // display: flex;
`;

type Props = {
  uiElements: JSX.Element[];
  displayMilliseconds?: number;
  onAllItemsDisplayed?: () => void;
};

export function StaggerUiElementListDisplay({
  uiElements,
  displayMilliseconds = 600,
  onAllItemsDisplayed,
}: Props) {
  const [revealIndex, setRevealIndex] = useState(-1);
  const callbackFired = useRef(false);

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
      setRevealIndex((revealIndex) => revealIndex + 1);
    }, displayMilliseconds);
    return () => clearInterval(interval);
  }, [
    displayMilliseconds,
    onAllItemsDisplayed,
    revealIndex,
    uiElements.length,
  ]);

  return <>{uiElements.filter((_, i) => i <= revealIndex)}</>;
}
