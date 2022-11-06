import { useRouter } from "next/router";
import styled from "styled-components";
import { SpectatorPageLayout } from "../../components/SpectatorPageLayout";
import { useRPSGame } from "../../providers/SocketIoProvider";

const CenterAlignContainer = styled.div`
  display: flex;
  justify-content: center;
`;

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const game = useRPSGame(gameId);

  return (
    <SpectatorPageLayout>
      <h1>{gameId}</h1>
      {game ? (
        <div>{JSON.stringify(game.playerIds)}</div>
      ) : (
        <h2>{gameId} not found</h2>
      )}
    </SpectatorPageLayout>
  );
}

export default Page;
