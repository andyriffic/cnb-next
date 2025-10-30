import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import PlayerGameView from "../../../components/mystery-box/player";
import { useSocketIo } from "../../../providers/SocketIoProvider";

function Page() {
  const query = useRouter().query;
  const playerId = query.playerId as string;
  const gameId = query.gameId as string;

  const { mysteryBox } = useSocketIo();

  const game = useMemo(() => {
    return mysteryBox.games.find((g) => g.id === gameId);
  }, [gameId, mysteryBox.games]);

  const selectBox = useCallback(
    (boxId: number) => {
      if (!game) {
        return;
      }

      mysteryBox.playerSelectBox(gameId, playerId, game.currentRound.id, boxId);
    },
    [game, gameId, mysteryBox, playerId]
  );

  return game ? (
    <PlayerGameView
      game={game}
      playerId={playerId}
      selectBox={selectBox}
    ></PlayerGameView>
  ) : (
    <div>Game not found</div>
  );
}

export default Page;
