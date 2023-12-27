import { useRouter } from "next/router";
import { useMemo } from "react";
import { SmallHeading } from "../../../components/Atoms";
import { SpectatorPageLayout } from "../../../components/SpectatorPageLayout";
import { useSocketIo } from "../../../providers/SocketIoProvider";
import NumberCrunchGameScreen from "../../../components/number-crunch";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { numberCrunch } = useSocketIo();

  const game = useMemo(
    () => numberCrunch.games.find((game) => game.id === gameId),
    [gameId, numberCrunch.games]
  );

  return game ? (
    <NumberCrunchGameScreen game={game} />
  ) : (
    <SpectatorPageLayout>
      <SmallHeading>Cannot find game {gameId} yet</SmallHeading>
    </SpectatorPageLayout>
  );
}

export default Page;
