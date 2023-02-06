import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Heading, SubHeading } from "../../../components/Atoms";
import { PlayerPageLayout } from "../../../components/PlayerPageLayout";
import { PlayerGameCurrentRound } from "../../../components/rock-paper-scissors/PlayerGameCurrentRound";
import { PlayerGameScore } from "../../../components/rock-paper-scissors/PlayerGameScore";
import { useRPSGame } from "../../../providers/SocketIoProvider/useRockPaperScissorsSocket";

function Page() {
  const query = useRouter().query;
  const playerId = query.playerId as string;
  const gameId = query.gameId as string;

  const { game, makeMove } = useRPSGame(gameId);

  return (
    <PlayerPageLayout playerId={playerId}>
      {/* <p>
        {gameId}: {game ? "found" : "not found"}
      </p> */}
      {game && (
        <>
          <Heading>Round {game.roundHistory.length + 1}</Heading>
          <PlayerGameCurrentRound
            currentRound={game.currentRound}
            playerId={playerId}
            makeMove={makeMove}
          />
          <SubHeading>Score</SubHeading>
          <PlayerGameScore playerId={playerId} game={game} />
        </>
      )}
      <h5>
        <Link href={`/play/${playerId}`}>Back to home</Link>
      </h5>
    </PlayerPageLayout>
  );
}

export default Page;
