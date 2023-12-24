import { useRouter } from "next/router";
import { SmallHeading } from "../../../components/Atoms";
import { SpectatorPageLayout } from "../../../components/SpectatorPageLayout";
import { useSocketIo } from "../../../providers/SocketIoProvider";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { numberCrunch } = useSocketIo();
  const game = numberCrunch.games.find((game) => game.id === gameId);

  return game ? (
    <SpectatorPageLayout>
      <SmallHeading>Found game {game.id}</SmallHeading>
    </SpectatorPageLayout>
  ) : (
    <SpectatorPageLayout>
      <SmallHeading>Cannot find game {gameId} yet</SmallHeading>
    </SpectatorPageLayout>
  );
}

export default Page;
