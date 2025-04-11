import styled from "styled-components";
import { MysteryBoxPlayer } from "../../services/mystery-box/types";
import { PlayerAvatar } from "../PlayerAvatar";

const Container = styled.div`
  position: relative;
`;

type Props = {
  player: MysteryBoxPlayer;
};

type PlayerPosition = "waiting";

export const MysteryBoxPlayerUi = ({ player }: Props) => {
  return (
    <Container>
      <PlayerAvatar playerId={player.id} size="thumbnail" />
    </Container>
  );
};
