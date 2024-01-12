import { useState } from "react";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { generateRandomInt } from "../../utils/random";

type Props = {
  game: NumberCrunchGameView;
};

function PlayerRangeInput({
  min,
  max,
  onSubmit,
}: {
  min: number;
  max: number;
  onSubmit: (val: number) => void;
}) {
  const [val, setVal] = useState(generateRandomInt(min, max));
  return (
    <div>
      <input
        type="number"
        min={min}
        max={max}
        value={val}
        onChange={(e) => setVal(e.target.valueAsNumber)}
      />
      <button type="button" onClick={() => onSubmit(val)}>
        Guess
      </button>
    </div>
  );
}

export const DebugNumberCrunchGame = ({ game }: Props) => {
  const { numberCrunch } = useSocketIo();

  return (
    <>
      <div>
        <button type="button" onClick={() => numberCrunch.newRound(game.id)}>
          New Round
        </button>
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {game.players.map((p) => (
          <div key={p.id}>
            <p>{p.name}</p>
            <div>
              <PlayerRangeInput
                min={game.currentRound.range.low}
                max={game.currentRound.range.high}
                onSubmit={(val) => {
                  numberCrunch.makePlayerGuess(game.id, p.id, val);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
