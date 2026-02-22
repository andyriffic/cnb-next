import styled from "styled-components";
import {
  MysteryBoxGameRoundView,
  MysteryBoxGameView,
  MysteryBoxPlayerView,
} from "../../../services/mystery-box/types";
import { PlayerMysteryBoxUi } from "./PlayerMysteryBoxUI";

const BoxOptionContainer = styled.div`
  display: flex;
  margin: 2rem 0;
  padding: 0;
  align-items: center;
  justify-content: space-between;
`;

const BoxOptionContainerItem = styled.div`
  display: flex;
  justify-content: center;
  height: 20vw;
  width: 20vw;
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
  border-radius: 1rem;
`;

type Props = {
  round: MysteryBoxGameRoundView;
  player: MysteryBoxPlayerView;
  onSelect: (boxId: number) => void;
};

export const PlayerBoxSelection = ({ round, player, onSelect }: Props) => {
  const hasSelectedBox = player.currentlySelectedBoxId !== undefined;
  return (
    <div>
      <BoxOptionContainer key={round.id}>
        {round.boxes.map((box) => {
          const selectedThisBox =
            box.playerIds.includes(player.id) ||
            box.eliminatedPlayerIdsGuessingThisBox.includes(player.id);
          return (
            <BoxOptionContainerItem key={box.id}>
              <BoxButton
                onClick={() => onSelect(box.id)}
                disabled={player.currentlySelectedBoxId !== undefined}
              >
                <PlayerMysteryBoxUi
                  key={box.id}
                  box={box}
                  dim={hasSelectedBox && !selectedThisBox}
                  selected={selectedThisBox}
                />
              </BoxButton>
            </BoxOptionContainerItem>
          );
        })}
      </BoxOptionContainer>
    </div>
  );
};
