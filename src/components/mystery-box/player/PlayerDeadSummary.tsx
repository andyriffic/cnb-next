import styled from "styled-components";
import {
  MysteryBoxGameRoundView,
  MysteryBoxGameView,
  MysteryBoxPlayerView,
} from "../../../services/mystery-box/types";
import { CenterSpaced } from "../../Layouts";
import { SmallHeading } from "../../Atoms";
import { NumericValue } from "../../NumericValue";
import { PlayerMysteryBoxUi } from "./PlayerMysteryBoxUI";

const DeadIcon = styled.div`
  font-size: 5rem;
`;

const DefinitionList = styled.dl`
  display: flex;
  font-size: 1.5rem;
  align-items: center;
`;
const DefinitionTerm = styled.dt`
  margin-right: 1rem;
`;
const DefinitionValue = styled.dd`
  margin: 0;
  font-weight: bold;
  font-size: 2rem;
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
        <DefinitionList>
          <DefinitionTerm>Points:</DefinitionTerm>
          <DefinitionValue>
            <NumericValue>{player.lootTotals.points?.total || 0}</NumericValue>
          </DefinitionValue>
        </DefinitionList>
        <DefinitionList>
          <DefinitionTerm>Correct Bomb Guesses:</DefinitionTerm>
          <DefinitionValue>
            <NumericValue>
              {player.lootTotals["bonus-bomb-guess"]?.total || 0}
            </NumericValue>
          </DefinitionValue>
        </DefinitionList>
        <p></p>
      </div>
    </CenterSpaced>
  );
};
