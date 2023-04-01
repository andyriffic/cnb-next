import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AiOverloadGameScreen from "../../../components/ai-overlord";
import { AiOverlordGame } from "../../../services/ai-overlord/types";
import { fetchGetAiOverlordGame } from "../../../utils/api";

type Props = {};

const fakeGame: AiOverlordGame = {
  gameId: "123",
  aiOverlord: {
    battles: [],
    introduction: {
      english:
        "Greetings, I am the master of Rock Paper Scissors. Prepare to be crushed into dust, puny human!",
      chinese: "你好，我是石头剪刀布的大师。准备被压成灰尘吧，微不足道的人类！",
    },
  },
  opponents: [
    { playerId: "andy", name: "Andy", occupation: "Lead Developer" },
    { playerId: "marion", name: "Marion", occupation: "Product Manager" },
    { playerId: "nina", name: "Nina", occupation: "Delivery Lead" },
    { playerId: "kate", name: "Kate", occupation: "UX Designer" },
  ],
  taunts: [],
};

function Page({}: Props) {
  const [loadedGame, setLoadedGame] = useState<AiOverlordGame | undefined>();
  const router = useRouter();
  const gameId = router.query.gameId as string;

  useEffect(() => {
    fetchGetAiOverlordGame(gameId).then(setLoadedGame);
  }, [gameId]);

  return loadedGame ? (
    <AiOverloadGameScreen aiOverlordGame={loadedGame} />
  ) : (
    <div>Loading</div>
  );
}

export default Page;
