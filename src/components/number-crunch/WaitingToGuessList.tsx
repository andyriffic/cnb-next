import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { Pill } from "../Atoms";
import { PlayerAvatar } from "../PlayerAvatar";
import { Attention } from "../animations/Attention";

type Props = {
  game: NumberCrunchGameView;
};

export const WaitingToGuessList = ({ game }: Props) => {
  return (
    <div
      style={{
        display: "flex",
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
            opacity: p.guessedThisRound ? 1 : 0.7,
          }}
        >
          <Attention animate={!p.guessedThisRound} animation="shake">
            <PlayerAvatar
              playerId={p.id}
              size="thumbnail"
              hasAdvantage={p.advantage}
            />
          </Attention>
          <Pill>{p.name}</Pill>
          {/* <p>{p.guessedThisRound ? "✅" : " "}</p> */}
        </div>
      ))}
    </div>
  );
};
