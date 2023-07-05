import { useRouter } from "next/router";
import AiOverloadGameScreen from "../../../components/ai-overlord";
import { useAiOverlordGame } from "../../../providers/SocketIoProvider/useAiOverlord";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const team = router.query.team as string;
  const { aiOverlordGame } = useAiOverlordGame(gameId);

  return aiOverlordGame ? (
    <AiOverloadGameScreen aiOverlordGame={aiOverlordGame} team={team} />
  ) : (
    <div>Loading</div>
  );
}

export default Page;
