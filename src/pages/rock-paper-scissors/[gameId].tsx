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
  const { game, makeMove } = useRPSGame(gameId);

  return (
    <SpectatorPageLayout>
      <h1>{gameId}</h1>
      {game ? (
        <>
          <div>{JSON.stringify(game.playerIds)}</div>
          <div>{JSON.stringify(game.rounds)}</div>
          <div>
            {game.playerIds.map((pid) => (
              <div key={pid}>
                {pid}{" "}
                <div>
                  <button
                    onClick={() =>
                      makeMove({ playerId: pid, moveName: "rock" })
                    }
                  >
                    Rock
                  </button>
                  <button
                    onClick={() =>
                      makeMove({ playerId: pid, moveName: "paper" })
                    }
                  >
                    Paper
                  </button>
                  <button
                    onClick={() =>
                      makeMove({ playerId: pid, moveName: "scissors" })
                    }
                  >
                    Scissors
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <h2>{gameId} not found</h2>
      )}
    </SpectatorPageLayout>
  );
}

export default Page;
