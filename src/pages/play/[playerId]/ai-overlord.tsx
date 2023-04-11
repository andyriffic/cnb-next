import { useRouter } from "next/router";
import { PlayerPageLayout } from "../../../components/PlayerPageLayout";
import PlayerGameView from "../../../components/ai-overlord/play";
import { useAiOverlordGame } from "../../../providers/SocketIoProvider/useAiOverlord";

function Page() {
  const query = useRouter().query;
  const playerId = query.playerId as string;
  const gameId = query.gameId as string;

  const { aiOverlordGame } = useAiOverlordGame(gameId);

  return (
    <PlayerPageLayout playerId={playerId}>
      {aiOverlordGame ? (
        <PlayerGameView aiOverlordGame={aiOverlordGame} playerId={playerId} />
      ) : (
        <p>Game not found</p>
      )}
    </PlayerPageLayout>
  );
}

export default Page;
