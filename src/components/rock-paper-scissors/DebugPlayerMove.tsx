import styled from "styled-components";
import { useRPSGame } from "../../providers/SocketIoProvider/useRockPaperScissorsSocket";
import { RPSSpectatorGameView } from "../../services/rock-paper-scissors/types";

const Container = styled.div`
  display: flex;
  gap: 1rem;
`;

type Props = {
  game: RPSSpectatorGameView;
};

export const DebugPlayerMove = ({ game }: Props) => {
  const { makeMove } = useRPSGame(game.id);

  return (
    <Container>
      {game.playerIds.map((pid) => (
        <div key={pid}>
          <p>{pid}</p>
          <div>
            <button
              onClick={() => makeMove({ playerId: pid, moveName: "rock" })}
            >
              🪨
            </button>
            <button
              onClick={() => makeMove({ playerId: pid, moveName: "paper" })}
            >
              📄
            </button>
            <button
              onClick={() => makeMove({ playerId: pid, moveName: "scissors" })}
            >
              ✂️
            </button>
          </div>
        </div>
      ))}
    </Container>
  );
};
