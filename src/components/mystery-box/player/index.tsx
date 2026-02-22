import { useCallback, useMemo } from "react";
import { MysteryBoxGameView } from "../../../services/mystery-box/types";
import { SmallHeading } from "../../Atoms";
import { PlayerPageLayout } from "../../PlayerPageLayout";
import { PlayerBoxSelection } from "./PlayerBoxSelection";
import { PlayerDeadSummary } from "./PlayerDeadSummary";

type Props = {
  game: MysteryBoxGameView;
  playerId: string;
  selectBox: (boxId: number) => void;
  guessBombBox: (boxId: number) => void;
};

const View = ({ game, playerId, selectBox, guessBombBox }: Props) => {
  const player = useMemo(() => {
    return game.players.find((player) => player.id === playerId)!;
  }, [game.players, playerId]);

  const playerAlive = useMemo(() => {
    return player.status !== "eliminated" && player.status !== "winner";
  }, [player.status]);

  if (!player) {
    return (
      <div>
        Sorry, there is no player with id {playerId} in this game of Mystery Box
      </div>
    );
  }

  const selectBoxFunction = playerAlive ? selectBox : guessBombBox;

  return (
    <PlayerPageLayout
      playerId={playerId}
      headerContent={<SmallHeading>Mystery Box ({game.id}) 🎁</SmallHeading>}
    >
      {!game.gameOverSummary && (
        <>
          <SmallHeading centered={true}>
            Round {game.currentRound.id}
          </SmallHeading>

          <SmallHeading centered={true}>
            {playerAlive ? "Don't pick the bomb!" : "Find the bomb!"}
          </SmallHeading>
          <PlayerBoxSelection
            round={game.currentRound}
            player={player}
            onSelect={selectBoxFunction}
          />
        </>
      )}

      {!playerAlive && <PlayerDeadSummary player={player} game={game} />}
    </PlayerPageLayout>
  );
};

export default View;
