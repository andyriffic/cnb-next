import styled from "styled-components";
import {
  MysteryBoxGameRoundView,
  MysteryBoxGameView,
  MysteryBoxPlayerView,
} from "../../../services/mystery-box/types";
import { PlayerMysteryBoxUi } from "./PlayerMysteryBoxUI";

const BoxOptionContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-row: auto auto;
  grid-column-gap: 1rem;
  grid-row-gap: 4rem;
  margin: 2rem 0;
  padding: 0;
  align-items: center;
  justify-items: center;
`;

const BoxOptionContainerItem = styled.div`
  display: flex;
  justify-content: center;
  height: 80px;
  width: 80px;
  margin: 0;
  padding: 0;
`;

const BoxButton = styled.button`
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  cursor: pointer;
`;

type Props = {
  round: MysteryBoxGameRoundView;
  player: MysteryBoxPlayerView;
  onSelect: (boxId: number) => void;
};

export const PlayerBoxSelection = ({ round, player, onSelect }: Props) => {
  return (
    <div>
      <BoxOptionContainer key={round.id}>
        {round.boxes.map((box) => {
          return (
            <BoxOptionContainerItem key={box.id}>
              <BoxButton
                onClick={() => onSelect(box.id)}
                disabled={player.currentlySelectedBoxId !== undefined}
              >
                <PlayerMysteryBoxUi
                  key={box.id}
                  box={box}
                  selected={player.currentlySelectedBoxId === box.id}
                />
              </BoxButton>
            </BoxOptionContainerItem>
          );
        })}
      </BoxOptionContainer>
    </div>
  );
};
