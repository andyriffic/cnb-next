import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Heading, SubHeading } from "../../../components/Atoms";
import { PlayerPageLayout } from "../../../components/PlayerPageLayout";
import { useBettingGame } from "../../../providers/SocketIoProvider/useGroupBetting";

function Page() {
  const query = useRouter().query;
  const playerId = query.playerId as string;
  const gameId = query.gameId as string;

  const { bettingGame } = useBettingGame(gameId);

  return (
    <PlayerPageLayout>
      {/* <p>
        {gameId}: {game ? "found" : "not found"}
      </p> */}
      {bettingGame && (
        <>
          <Heading>Round {bettingGame.rounds.length}</Heading>
          <SubHeading>Options</SubHeading>
          {bettingGame.rounds[0]?.bettingOptions.map((round) => (
            <div key={round.id}>
              {round.name}: {round.odds}:1
            </div>
          ))}
        </>
      )}
      <h5>
        <Link href={`/play/${playerId}`}>Back to home</Link>
      </h5>
    </PlayerPageLayout>
  );
}

export default Page;
