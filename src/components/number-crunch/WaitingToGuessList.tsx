import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { Pill } from "../Atoms";
import { PlayerAvatar } from "../PlayerAvatar";

type Props = {
  game: NumberCrunchGameView;
};

export const WaitingToGuessList = ({ game }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        margin: "2rem 0",
      }}
    >
      {game.players.map((p) => (
        <div
          key={p.id}
          style={{
            color: p.guessedThisRound ? "lightgreen" : "darkred",
            textAlign: "center",
            opacity: p.guessedThisRound ? 1 : 0.5,
          }}
        >
          <PlayerAvatar playerId={p.id} size="thumbnail" />
          <Pill>{p.name}</Pill>
          <p>{p.guessedThisRound ? "✅" : " "}</p>
        </div>
      ))}
    </div>
  );
};
