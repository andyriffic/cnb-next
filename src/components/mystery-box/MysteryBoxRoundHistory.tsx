import { MysteryBoxGame } from "../../services/mystery-box/types";
import { SmallHeading } from "../Atoms";

type Props = {
  game: MysteryBoxGame;
};

export const MysteryBoxRoundHistory = ({ game }: Props) => {
  //codepen.io/RoyLee0702/pen/RwNgVya
  https: return (
    <>
      {game.rounds.map((round) => {
        return (
          <div key={round.id} style={{ display: "flex", gap: "0.5rem" }}>
            <SmallHeading style={{ textAlign: "center" }}>
              {round.id}
            </SmallHeading>
            {/* <div style={{ display: "flex", gap: "0.5rem" }}>
      {box.playerIds.map((pid) => (
        <p key={pid}>{pid}</p>
      ))}
    </div> */}
          </div>
        );
      })}
    </>
  );
};
