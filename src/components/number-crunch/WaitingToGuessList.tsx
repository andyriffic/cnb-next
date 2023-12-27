import { NumberCrunchGame } from "../../services/number-crunch/types";

type Props = {
  game: NumberCrunchGame;
};

export const WaitingToGuessList = ({ game }: Props) => {
  return (
    <div>
      {game.players.map((p) => (
        <>{p.name}</>
      ))}
    </div>
  );
};
