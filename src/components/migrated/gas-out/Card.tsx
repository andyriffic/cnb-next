import React, { useEffect } from "react";
import styled from "styled-components";
import { GasCard } from "../../../services/migrated/gas-out/types";
import { useSound } from "../../hooks/useSound";
import { Appear } from "../../animations/Appear";

const CardContainer = styled.div<{ special: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  border: 5px solid ${({ theme }) => theme.color.gasGame.cardBorderColor};
  border-radius: 10px;
  width: 70px;
  height: 100px;
  background-color: ${({ theme, special }) =>
    special
      ? theme.color.gasGame.cardBackgroundColorSpecial
      : theme.color.gasGame.cardBackgroundColor};
  color: ${({ theme, special }) =>
    special
      ? theme.color.gasGame.cardTextColorSpecial
      : theme.color.gasGame.cardTextColor01};
  box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px,
    rgba(6, 24, 44, 0.65) 0px 4px 6px -1px,
    rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
`;

const CardNumber = styled.div`
  font-size: 2rem;
  font-family: ${({ theme }) => theme.fontFamily.numbers};
`;

const CardText = styled.div`
  font-size: 1.2rem;
  font-family: ${({ theme }) => theme.fontFamily.feature};
`;

const CardIcon = styled.div`
  font-size: 2rem;
`;

type Props = {
  card: GasCard;
  pressesRemaining: number;
};

function renderCard(
  card: GasCard,
  pressesRemaining: number
): JSX.Element | null {
  switch (card.type) {
    case "press":
    case "risky":
      return <CardNumber>{pressesRemaining}</CardNumber>;
    case "skip":
      return <CardText>skip</CardText>;
    case "reverse":
      return <CardIcon>↔</CardIcon>;
    default:
      return <CardText>{card.type}</CardText>;
  }
}

export function Card({ card, pressesRemaining }: Props): JSX.Element | null {
  const { play } = useSound();

  useEffect(() => {
    switch (card.type) {
      case "press":
        play("gas-play-number-card");
        break;
      case "reverse":
        play("gas-play-reverse-card");
        break;
      case "skip":
        play("gas-play-skip-card");
        break;
      case "risky":
        play("gas-play-risky-card");
        break;
      default:
        break;
    }
  }, [card.type, play]);

  if (card.type === "press" && pressesRemaining === 0) {
    return null;
  }
  return (
    <Appear animation="flip-in">
      <CardContainer special={card.type === "risky"}>
        {renderCard(card, pressesRemaining)}
      </CardContainer>
    </Appear>
  );
}
