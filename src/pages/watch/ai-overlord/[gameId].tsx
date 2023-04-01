import { useRouter } from "next/router";
import AiOverloadGameScreen from "../../../components/ai-overlord";
import { useAiOverlordGame } from "../../../providers/SocketIoProvider/useAiOverlord";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { aiOverlordGame } = useAiOverlordGame(gameId);

  return aiOverlordGame ? (
    <AiOverloadGameScreen aiOverlordGame={aiOverlordGame} />
  ) : (
    <div>Loading</div>
  );
}

export default Page;
