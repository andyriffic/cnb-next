import Image from "next/image";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (revealIndex >= uiElements.length) {
      onAllItemsDisplayed && onAllItemsDisplayed();
      return;
    }
    console.log("initialise interval");
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
