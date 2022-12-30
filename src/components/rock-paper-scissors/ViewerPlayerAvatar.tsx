import { AvatarSize, FacingDirection, PlayerAvatar } from "../PlayerAvatar";

type Props = {
  playerId: string;
  facing?: FacingDirection;
  size?: AvatarSize;
};

export const ViewerPlayersAvatar = ({
  playerId,
  facing,
  size,
}: Props): JSX.Element => {
  return <PlayerAvatar playerId={playerId} facing={facing} size={size} />;
};
