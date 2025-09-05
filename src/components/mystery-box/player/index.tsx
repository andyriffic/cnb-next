import { useCallback, useMemo } from "react";
import { MysteryBoxGameView } from "../../../services/mystery-box/types";
import { SmallHeading } from "../../Atoms";
import { PlayerPageLayout } from "../../PlayerPageLayout";
import { PlayerBoxSelection } from "./PlayerBoxSelection";

type Props = {
  game: MysteryBoxGameView;
  playerId: string;
  selectBox: (boxId: number) => void;
};

const View = ({ game, playerId, selectBox }: Props) => {
  const player = useMemo(() => {
    return game.players.find((player) => player.id === playerId)!;
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
      <p>
        Hello {player.name} ({player.currentlySelectedBoxId})
      </p>
      <PlayerBoxSelection
        round={game.currentRound}
        player={player}
        onSelect={selectBox}
      />
    </PlayerPageLayout>
  );
};

export default View;
