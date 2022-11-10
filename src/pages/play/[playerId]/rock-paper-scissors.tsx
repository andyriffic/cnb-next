import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { PlayerPageLayout } from "../../../components/PlayerPageLayout";
import { PlayerGameCurrentRound } from "../../../components/rock-paper-scissors/PlayerGameCurrentRound";
import { useRPSGame } from "../../../providers/SocketIoProvider";

function Page() {
  const query = useRouter().query;
  const playerId = query.playerId as string;
  const gameId = query.gameId as string;

  const { game, makeMove } = useRPSGame(gameId);

  return (
    <PlayerPageLayout>
      {/* <p>
        {gameId}: {game ? "found" : "not found"}
      </p> */}
      {game && (
        <PlayerGameCurrentRound
          currentRound={game.rounds[game.rounds.length - 1]!}
          playerId={playerId}
          makeMove={makeMove}
        />
      )}
      <h5>
        <Link href={`/play/${playerId}`}>Back to games</Link>
      </h5>
    </PlayerPageLayout>
  );
}

export default Page;
