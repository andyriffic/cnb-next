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
  player: MysteryBoxPlayerView;
};

export const PlayerLootTotals = ({ player }: Props) => {
  return (
    <div>
      <h3>Your Loot Totals so far</h3>
      <div>
        <p>Coins: {player.lootTotals.coin?.total || 0}</p>
        <p>Points: {player.lootTotals.points?.total}</p>
      </div>
    </div>
  );
};
