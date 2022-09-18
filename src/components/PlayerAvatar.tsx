import { Player } from "../types/Player";

type Props = {
  player: Player;
};
export const PlayerAvatar = ({ player }: Props): JSX.Element => {
  return <h2>{player.name}</h2>;
};
