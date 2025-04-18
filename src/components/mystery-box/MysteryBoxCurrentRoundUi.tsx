import styled from "styled-components";
import { MysteryBoxGameRoundView } from "../../services/mystery-box/types";
import { SmallHeading } from "../Atoms";
import { MysteryBoxUi } from "./MysteryBox";

const BoxOptionContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-row: auto auto;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  height: 80vh;
  width: 100vw;
`;
const BoxOptionContainerItem = styled.div`
  display: flex;
  justify-content: center;
`;

type Props = {
  round: MysteryBoxGameRoundView;
};

type BoxColor = "red" | "blue" | "green" | "yellow";

export const MysteryBoxCurrentRoundUi = ({ round }: Props) => {
  return (
    <>
      <SmallHeading>Round {round.id}</SmallHeading>
      <BoxOptionContainer>
        {round.boxes.map((box) => {
          return (
            <BoxOptionContainerItem key={box.id}>
              <MysteryBoxUi key={box.id} box={box} />
            </BoxOptionContainerItem>
          );
        })}
      </BoxOptionContainer>
    </>
  );
};
