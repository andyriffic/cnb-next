import { useMemo } from "react";
import { MysteryBoxGameView } from "../../../services/mystery-box/types";
import { SmallHeading } from "../../Atoms";
import { PlayerPageLayout } from "../../PlayerPageLayout";

type Props = {
  game: MysteryBoxGameView;
  playerId: string;
};

const View = ({ game, playerId }: Props) => {
  const player = useMemo(() => {
    return game.players.find((player) => player.id === playerId);
  }, [game.players, playerId]);

  if (!player) {
    return (
      <div>
        Sorry, there is no player with id {playerId} in this game of Mystery Box
      </div>
    );
  }

  return (
    <PlayerPageLayout
      playerId={playerId}
      headerContent={<SmallHeading>Mystery Box ({game.id}) 🎁</SmallHeading>}
    >
      <p>Hello {player.name}</p>
    </PlayerPageLayout>
  );
};

export default View;
