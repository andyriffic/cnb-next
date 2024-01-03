import { useRouter } from "next/router";
import { useMemo } from "react";
import { useSocketIo } from "../../../providers/SocketIoProvider";
import PlayerGameView from "../../../components/number-crunch/player";

function Page() {
  const query = useRouter().query;
  const playerId = query.playerId as string;
  const gameId = query.gameId as string;

  const { numberCrunch } = useSocketIo();

  const game = useMemo(() => {
    return numberCrunch.games.find((g) => g.id === gameId);
  }, [gameId, numberCrunch.games]);

  return game ? (
    <PlayerGameView game={game} playerId={playerId}></PlayerGameView>
  ) : (
    <div>Game not found</div>
  );
}

export default Page;
