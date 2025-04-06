import styled from "styled-components";
import { MysteryBoxGameRound } from "../../services/mystery-box/types";
import { SmallHeading } from "../Atoms";
import { MysteryBoxUi } from "./MysteryBox";

const BoxOptionContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-row: auto auto;
  grid-column-gap: 0.2rem;
  grid-row-gap: 3rem;
`;
const BoxOptionContainerItem = styled.div`
  display: flex;
  justify-content: center;
`;

type Props = {
  round: MysteryBoxGameRound;
};

export const MysteryBoxCurrentRoundUi = ({ round }: Props) => {
  return (
    <>
      <SmallHeading>Round {round.id}</SmallHeading>
      <BoxOptionContainer>
        {round.boxes.map((box) => {
          return (
            <BoxOptionContainerItem>
              <MysteryBoxUi key={box.id} box={box} />
            </BoxOptionContainerItem>
          );
        })}
      </BoxOptionContainer>
    </>
  );
};
