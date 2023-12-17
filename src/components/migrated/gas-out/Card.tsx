import React, { useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { GasCard } from "../../../services/migrated/gas-out/types";
import { useSound } from "../../hooks/useSound";
import { Appear } from "../../animations/Appear";
import { COLORS, FONT_FAMILY } from "../../../colors";
import THEME from "../../../themes/types";
import bombImage from "./cnb-card-bomb.png";
import curseImage from "./cnb-card-curse.png";
import reverseImage from "./cnb-card-reverse.png";
import skipImage from "./cnb-card-skip.png";

const BaseCard = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 15px 0;
  align-items: center;
  flex-direction: column;
  /* gap: 1rem; */
  border: 5px solid ${COLORS.gasGame.cardBorderColor};
  border-radius: 10px;
  width: 100px;
  height: 160px;
  color: ${THEME.colours.ballonGame.cardText};
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
  position: relative;
`;

const NumberCard = styled(BaseCard)`
  background-color: ${THEME.colours.ballonGame.numberCardBackground};
`;

const CurseCard = styled(BaseCard)`
  background-color: ${THEME.colours.ballonGame.cursedCardBackground};
`;

const ReverseCard = styled(BaseCard)`
  background-color: ${THEME.colours.ballonGame.reverseCardBackground};
`;

const BombCard = styled(BaseCard)`
  background-color: ${THEME.colours.ballonGame.bombCardBackground};
`;

const SkipCard = styled(BaseCard)`
  background-color: ${THEME.colours.ballonGame.skipCardBackground};
`;

const PressesRemainingText = styled.div`
  font-size: 3rem;
  font-family: ${THEME.fonts.feature};
  margin: 0;
  padding: 0;
  line-height: 100%;
`;

const CardImage = styled(Image)`
  /* position: absolute;
  bottom: 5px; */
`;

const CardText = styled.div`
  font-size: 1.4rem;
  text-transform: uppercase;
  font-family: ${THEME.fonts.feature};
  letter-spacing: 0.1rem;
  line-height: 100%;
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
      return (
        <NumberCard>
          <CardText>&nbsp;</CardText>
          <PressesRemainingText>{pressesRemaining}</PressesRemainingText>
        </NumberCard>
      );
    case "risky":
      return (
        <CurseCard>
          <CardText>Curse</CardText>
          <PressesRemainingText>{pressesRemaining}</PressesRemainingText>
          <CardImage src={curseImage} width={40} alt="" />
        </CurseCard>
      );
    case "bomb":
      return (
        <BombCard>
          <CardText>Bomb</CardText>
          <PressesRemainingText>{pressesRemaining}</PressesRemainingText>
          <CardImage src={bombImage} width={40} alt="" />
        </BombCard>
      );
    case "skip":
      return (
        <SkipCard style={{ justifyContent: "center", gap: "1rem" }}>
          <Image src={skipImage} width={40} alt="" />
          <CardText>skip</CardText>
        </SkipCard>
      );
    case "reverse":
      return (
        <ReverseCard style={{ justifyContent: "center", gap: "1rem" }}>
          <Image src={reverseImage} width={40} alt="" />
          <CardText style={{ fontSize: "1.1rem" }}>Reverse</CardText>
        </ReverseCard>
      );
    default:
      return <CardText>{card.type}</CardText>;
  }
}

export function BalloonCard({
  card,
  pressesRemaining,
}: Props): JSX.Element | null {
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
      case "bomb":
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
    <Appear animation="flip-in">{renderCard(card, pressesRemaining)}</Appear>
  );
}
