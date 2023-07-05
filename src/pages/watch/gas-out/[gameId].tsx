import { useRouter } from "next/router";
import { useSocketIo } from "../../../providers/SocketIoProvider";
import GasOutGameScreen from "../../../components/migrated/gas-out";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const team = router.query.team as string;
  const { gasGame } = useSocketIo();
  const game = gasGame.gasGames.find((game) => game.id === gameId);

  return game ? (
    <GasOutGameScreen gasGame={game} team={team} />
  ) : (
    <div>Loading</div>
  );
}

export default Page;
