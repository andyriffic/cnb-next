import { useRouter } from "next/router";
import { useMemo } from "react";
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

  return game ? (
    <PlayerGameView game={game} playerId={playerId}></PlayerGameView>
  ) : (
    <div>Game not found</div>
  );
}

export default Page;
