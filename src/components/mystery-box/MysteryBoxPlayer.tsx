import styled from "styled-components";
import {
  MysteryBoxPlayer,
  MysteryBoxPlayerView,
} from "../../services/mystery-box/types";
import { PlayerAvatar } from "../PlayerAvatar";

const Container = styled.div`
  position: relative;
`;

type Props = {
  player: MysteryBoxPlayerView;
};

export const MysteryBoxPlayerUi = ({ player }: Props) => {
  return (
    <Container>
      <PlayerAvatar playerId={player.id} size="thumbnail" />
      <div>{player.status}</div>
    </Container>
  );
};
