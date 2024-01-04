import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
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

  const makePlayerGuess = useCallback(
    (guess: number) => {
      numberCrunch.makePlayerGuess(gameId, playerId, guess);
    },
    [gameId, numberCrunch, playerId]
  );

  return game ? (
    <PlayerGameView
      game={game}
      playerId={playerId}
      makePlayerGuess={makePlayerGuess}
    ></PlayerGameView>
  ) : (
    <div>Game not found</div>
  );
}

export default Page;
