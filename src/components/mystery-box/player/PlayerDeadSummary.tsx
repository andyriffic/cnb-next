import styled from "styled-components";
import {
  MysteryBoxGameRoundView,
  MysteryBoxGameView,
  MysteryBoxPlayerView,
} from "../../../services/mystery-box/types";
import { CenterSpaced } from "../../Layouts";
import { SmallHeading } from "../../Atoms";
import { PlayerMysteryBoxUi } from "./PlayerMysteryBoxUI";

const DeadIcon = styled.div`
  font-size: 5rem;
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
  game: MysteryBoxGameView;
  player: MysteryBoxPlayerView;
};

export const PlayerDeadSummary = ({ player, game }: Props) => {
  return (
    <CenterSpaced stacked={true}>
      <SmallHeading>You dead!</SmallHeading>
      <DeadIcon>☠️</DeadIcon>
      <div>
        <p>Points: {player.lootTotals.points?.total || 0}</p>
      </div>
    </CenterSpaced>
  );
};
