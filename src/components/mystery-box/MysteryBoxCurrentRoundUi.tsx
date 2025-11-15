import styled from "styled-components";
import { MysteryBoxGameRoundView } from "../../services/mystery-box/types";
import { FeatureHeading, SmallHeading } from "../Atoms";
import { Appear } from "../animations/Appear";
import { growAnimation } from "../animations/keyframes/size";
import { MysteryBoxUi } from "./MysteryBox";
import {
  MysteryBoxGameState,
  MysteryBoxUIState,
} from "./useMysteryBoxGameState";

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

const Explosion = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12rem;
  z-index: 2;
`;

const ExplodeAnimation = styled.div`
  animation: ${growAnimation} 200ms ease-in-out 2000ms 1 both;
`;

const BoxOptionContainerItem = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
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

                {box.contents.type === "bomb" &&
                  gameState.gameState ===
                    MysteryBoxGameState.SHOW_BOX_REVEAL_RESULT && (
                    <Explosion key={`${round.id}-${box.id}-explosion`}>
                      <ExplodeAnimation>💥</ExplodeAnimation>
                    </Explosion>
                  )}
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
