import { NumberCrunchGameView } from "../../services/number-crunch/types";

type Props = {
  game: NumberCrunchGameView;
};

export const WaitingToGuessList = ({ game }: Props) => {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      {game.players.map((p) => (
        <div
          key={p.id}
          style={{ color: p.guessedThisRound ? "lightgreen" : "darkred" }}
        >
          <p>{p.name}</p>
          {p.guessedThisRound && <>✅</>}
        </div>
      ))}
    </div>
  );
};
