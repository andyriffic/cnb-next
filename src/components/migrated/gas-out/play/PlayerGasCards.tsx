import styled from "styled-components";
import { COLORS, FONT_FAMILY } from "../../../../colors";
import {
  CurseType,
  GasCard,
  GasPlayer,
} from "../../../../services/migrated/gas-out/types";

const Container = styled.div`
  display: flex;
  gap: 10vw;
  transition: opacity 300ms ease-out;
`;

const Card = styled.button<{ special: boolean }>`
  border: 5px solid ${COLORS.gasGame.cardBorderColor};
  border-radius: 5px;
  width: 20vw;
  height: 25vw;
  font-size: 2rem;
  text-transform: uppercase;
  color: ${({ special }) =>
    special
      ? COLORS.gasGame.cardTextColorSpecial
      : COLORS.gasGame.cardTextColor01};
  background-color: ${({ special }) =>
    special
      ? COLORS.gasGame.cardBackgroundColorSpecial
      : COLORS.gasGame.cardBackgroundColor};
  font-family: ${FONT_FAMILY.numeric};
`;

const CardNumber = styled.div`
  font-size: 2rem;
`;

const CardText = styled.div`
  font-size: 0.8rem;
`;

const applyCurse = (card: GasCard, curse: CurseType | undefined): number => {
  //TODO: presses should be applied at the server

  if (!curse || card.type !== "press") {
    return card.presses;
  }

  if (curse === "double-press") {
    return card.presses * 2;
  }

  return card.presses;
};

type Props = {
  cards: GasCard[];
  enabled: boolean;
  playCard: (cardIndex: number) => void;
  player: GasPlayer;
};

export const PlayerGasCards = ({
  cards,
  enabled,
  playCard,
  player,
}: Props): JSX.Element => {
  return (
    <Container style={{ opacity: enabled ? 1 : 0.6 }}>
      {cards.map((c, i) => (
        <Card
          key={i}
          disabled={!enabled}
          onClick={() => playCard(i)}
          special={c.type === "risky"}
        >
          {c.type === "press" && (
            <CardNumber>{applyCurse(c, player.curse)}</CardNumber>
          )}
          {c.type === "risky" && <CardNumber>{c.presses}</CardNumber>}
          {c.type === "skip" && <CardText>Skip</CardText>}
          {c.type === "reverse" && <CardText>↔</CardText>}
        </Card>
      ))}
    </Container>
  );
};
