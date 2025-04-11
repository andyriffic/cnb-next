import styled from "styled-components";
import { MysteryBoxGame } from "../../services/mystery-box/types";
import { MysteryBoxPlayerUi } from "./MysteryBoxPlayer";

const PositionedPlayer = styled.div`
  position: absolute;
  top: 50%;
  right: 50%;
`;

type Props = {
  game: MysteryBoxGame;
};

export const MysteryBoxActivePlayers = ({ game }: Props) => {
  return (
    <>
      {game.players.map((player) => {
        return (
          <PositionedPlayer key={player.id}>
            <MysteryBoxPlayerUi player={player} />
          </PositionedPlayer>
        );
      })}
    </>
  );
};
