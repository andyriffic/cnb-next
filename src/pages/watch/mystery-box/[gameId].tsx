import { useRouter } from "next/router";
import { useMemo } from "react";
import { SmallHeading } from "../../../components/Atoms";
import { SpectatorPageLayout } from "../../../components/SpectatorPageLayout";
import { useSocketIo } from "../../../providers/SocketIoProvider";
import GameScreen from "../../../components/mystery-box";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { mysteryBox } = useSocketIo();

  const game = useMemo(
    () => mysteryBox.games.find((game) => game.id === gameId),
    [gameId, mysteryBox.games]
  );

  return game ? (
    <GameScreen game={game} />
  ) : (
    <SpectatorPageLayout>
      <SmallHeading>Cannot find game {gameId} yet</SmallHeading>
    </SpectatorPageLayout>
  );
}

export default Page;
