import styled from "styled-components";
import { useRPSGame } from "../../providers/SocketIoProvider/useRockPaperScissorsSocket";
import { RPSSpectatorGameView } from "../../services/rock-paper-scissors/types";
import { selectRandomOneOf } from "../../utils/random";

const Container = styled.div`
  display: flex;
  gap: 1rem;
`;

type Props = {
  game: RPSSpectatorGameView;
};

export const DebugPlayerMove = ({ game }: Props) => {
  const { makeMove } = useRPSGame(game.id);

  const randomMoves = () => {
    game.players.forEach((p) =>
      makeMove({
        playerId: p.id,
        moveName: selectRandomOneOf(["rock", "paper", "scissors"]),
      })
    );
  };

  return (
    <Container>
      <button onClick={randomMoves}>random moves</button>
      {game.players.map((p) => (
        <div key={p.id}>
          <p>{p.id}</p>
          <div>
            <button
              onClick={() => makeMove({ playerId: p.id, moveName: "rock" })}
            >
              🪨
            </button>
            <button
              onClick={() => makeMove({ playerId: p.id, moveName: "paper" })}
            >
              📄
            </button>
            <button
              onClick={() => makeMove({ playerId: p.id, moveName: "scissors" })}
            >
              ✂️
            </button>
          </div>
        </div>
      ))}
    </Container>
  );
};
