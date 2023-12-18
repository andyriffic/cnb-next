import styled from "styled-components";
import { GasCard } from "../../../../services/migrated/gas-out/types";
import { BalloonCard } from "../BalloonCard";
import { NormalText } from "../../../Atoms";
import { PressableButton } from "./PressableButton";

const Container = styled.div`
  /* display: flex;
  gap: 1rem;
  justify-content: space-between; */
`;

type Props = {
  card: GasCard;
};

export const PlayerSelectedCardInfo = ({ card }: Props): JSX.Element => {
  return (
    <Container>
      <BalloonCard card={card} pressesRemaining={card.presses} />
      {/* <div>
        <ul>
          <li>
            <NormalText>Survive {card.presses} presses</NormalText>
          </li>

          <li>
            <NormalText>
              If you do the next players points will be doubled and they must
              play a card with points (i.e. not a skip or reverse)
            </NormalText>
          </li>
        </ul>
      </div> */}
    </Container>
  );
};
