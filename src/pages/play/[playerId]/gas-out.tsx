import { useRouter } from "next/router";
import { PlayerPageLayout } from "../../../components/PlayerPageLayout";
import PlayerGameView from "../../../components/migrated/gas-out/play";
import { useAiOverlordGame } from "../../../providers/SocketIoProvider/useAiOverlord";
import { useSocketIo } from "../../../providers/SocketIoProvider";

function Page() {
  const query = useRouter().query;
  const playerId = query.playerId as string;
  const gameId = query.gameId as string;

  const {
    gasGame: { gasGames },
  } = useSocketIo();
  const game = gasGames.find((game) => game.id === gameId);

  return (
    <PlayerPageLayout playerId={playerId}>
      {game ? (
        <PlayerGameView gasGameId={gameId} playerId={playerId} />
      ) : (
        <p>Game not found</p>
      )}
    </PlayerPageLayout>
  );
}

export default Page;
