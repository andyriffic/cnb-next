import styled from "styled-components";
import { MysteryBoxGameRoundView } from "../../services/mystery-box/types";
import { SmallHeading } from "../Atoms";
import { MysteryBoxUi } from "./MysteryBox";
import { MysteryBoxUIState } from "./useMysteryBoxGameState";

const BoxLayoutContainer = styled.div`
  position: relative;
  width: 100%;
  height: 70vh;
`;

const PositionedBox = styled.div<{ position: BoxPosition }>`
  position: absolute;
  top: ${({ position }) =>
    position.topPx !== undefined ? `${position.topPx}px` : "auto"};
  left: ${({ position }) =>
    position.leftPx !== undefined ? `${position.leftPx}px` : "auto"};
  right: ${({ position }) =>
    position.rightPx !== undefined ? `${position.rightPx}px` : "auto"};
  bottom: ${({ position }) =>
    position.bottomPx !== undefined ? `${position.bottomPx}px` : "auto"};
`;

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

type BoxPosition = {
  leftPx?: number;
  topPx?: number;
  rightPx?: number;
  bottomPx?: number;
};

const BoxPositions: BoxPosition[] = [
  { leftPx: 250, topPx: 100 },
  { rightPx: 250, topPx: 100 },
  { leftPx: 250, topPx: 500 },
  { rightPx: 250, topPx: 500 },
];

type Props = {
  gameState: MysteryBoxUIState;
  round: MysteryBoxGameRoundView;
};

export const MysteryBoxCurrentRoundUi = ({ round, gameState }: Props) => {
  return (
    <>
      <SmallHeading>Round {round.id}</SmallHeading>
      <SmallHeading style={{ textAlign: "center" }}>
        {round.specialInfo}
      </SmallHeading>
      <BoxLayoutContainer>
        {round.boxes.map((box, index) => {
          const position = BoxPositions[index] || {};
          return (
            <PositionedBox key={box.id} position={position}>
              <BoxOptionContainerItem>
                <MysteryBoxUi
                  key={`${round.id}-${box.id}`}
                  box={box}
                  open={gameState.boxesOpen}
                />
              </BoxOptionContainerItem>
            </PositionedBox>
          );
        })}
      </BoxLayoutContainer>
      {/* <BoxOptionContainer key={round.id}>
        {round.boxes.map((box) => {
          return (
            <BoxOptionContainerItem key={box.id}>
              <MysteryBoxUi key={box.id} box={box} open={gameState.boxesOpen} />
            </BoxOptionContainerItem>
          );
        })}
      </BoxOptionContainer> */}
    </>
  );
};
