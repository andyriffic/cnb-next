import styled from "styled-components";
import { COLORS, FONT_FAMILY } from "../../../../colors";
import {
  CurseType,
  GasCard,
  GasPlayer,
} from "../../../../services/migrated/gas-out/types";
import { BalloonCard } from "../BalloonCard";

const Container = styled.div`
  display: flex;
  /* gap: 2rem; */
  transition: opacity 300ms ease-out;
  justify-content: space-between;
  padding: 0 1rem;
`;

const CardButtonContainer = styled.button`
  border: 0;
  background: none;

  &:disabled {
    opacity: 0.5;
  }
`;

const CardNumber = styled.div`
  font-size: 2rem;
`;

const CardText = styled.div`
  font-size: 2rem;
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

const isCardDisabled = (
  card: GasCard,
  curse: CurseType | undefined
): boolean => {
  if (!curse) {
    return false;
  }

  if (card.type === "skip" || card.type === "reverse") {
    return true;
  }
  return false;
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
    <Container style={{ opacity: enabled ? 1 : 0.8 }}>
      {cards.map((c, i) => (
        <CardButtonContainer
          key={i}
          disabled={!enabled || isCardDisabled(c, player.curse)}
          onClick={() => playCard(i)}
        >
          <BalloonCard
            card={c}
            pressesRemaining={applyCurse(c, player.curse)}
          ></BalloonCard>
        </CardButtonContainer>
      ))}
    </Container>
  );
};
