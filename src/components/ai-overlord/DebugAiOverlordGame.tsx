import { useAiOverlordGame } from "../../providers/SocketIoProvider/useAiOverlord";
import { selectRandomOneOf } from "../../utils/random";
import { AiOverlordGameView } from "./hooks/useAiOverlordGameView";

type Props = {
  gameView: AiOverlordGameView;
};

export const DebugAiOverlordGame = ({ gameView }: Props) => {
  const { makeOpponentMove, newOpponent, startThinking, finaliseGame } =
    useAiOverlordGame(gameView.gameId);

  return (
    <div>
      {gameView.currentOpponent && (
        <div>
          <p>
            Current Player:{" "}
            <strong style={{ fontWeight: "bold" }}>
              {gameView.currentOpponent.name}
            </strong>
          </p>
          {!gameView.currentOpponentMove && (
            <div>
              <button
                onClick={() => {
                  makeOpponentMove(gameView.currentOpponent!.playerId, "rock");
                }}
              >
                rock
              </button>
              <button
                onClick={() => {
                  makeOpponentMove(gameView.currentOpponent!.playerId, "paper");
                }}
              >
                paper
              </button>
              <button
                onClick={() => {
                  makeOpponentMove(
                    gameView.currentOpponent!.playerId,
                    "scissors"
                  );
                }}
              >
                scissors
              </button>
            </div>
          )}
        </div>
      )}
      <p>
        Remaining Opponents:{" "}
        {gameView.remainingOpponents.length > 0 && (
          <button
            onClick={() => {
              startThinking();
              newOpponent(
                selectRandomOneOf(gameView.remainingOpponents).playerId
              );
            }}
          >
            RANDOM OPPONENT
          </button>
        )}
        {gameView.remainingOpponents.map((o) => (
          <button
            key={o.playerId}
            onClick={() => {
              startThinking();
              newOpponent(o.playerId);
            }}
          >
            {o.name}
          </button>
        ))}
      </p>
      <p>
        <button
          disabled={!gameView.allPlayersHavePlayed}
          onClick={() => {
            startThinking();
            finaliseGame();
          }}
        >
          Finish game
        </button>
      </p>
    </div>
  );
};
