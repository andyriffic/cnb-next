import { useRouter } from "next/router";
import { useSocketIo } from "../../../providers/SocketIoProvider";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { gasGame } = useSocketIo();
  const game = gasGame.gasGames.find((game) => game.id === gameId);

  return game ? <h1>Game found</h1> : <div>Loading</div>;
}

export default Page;
