import styled from "styled-components";
import { MysteryBoxGameRoundView } from "../../services/mystery-box/types";
import { FeatureHeading, SmallHeading } from "../Atoms";
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
    position.top !== undefined ? `${position.top}vh` : "auto"};
  left: ${({ position }) =>
    position.left !== undefined ? `${position.left}vw` : "auto"};
  right: ${({ position }) =>
    position.right !== undefined ? `${position.right}vw` : "auto"};
  bottom: ${({ position }) =>
    position.bottom !== undefined ? `${position.bottom}vh` : "auto"};
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
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
};

const BoxPositions: BoxPosition[] = [
  { left: 10, top: 5 },
  { right: 10, top: 5 },
  { left: 10, bottom: 25 },
  { right: 10, bottom: 25 },
];

type Props = {
  gameState: MysteryBoxUIState;
  round: MysteryBoxGameRoundView;
};

export const MysteryBoxCurrentRoundUi = ({ round, gameState }: Props) => {
  return (
    <>
      <FeatureHeading
        style={{ fontSize: "6rem", textAlign: "center", marginTop: "2rem" }}
      >
        Round {round.id}
      </FeatureHeading>

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
