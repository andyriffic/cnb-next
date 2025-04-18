import {
  MysteryBoxGame,
  MysteryBoxGameView,
} from "../../services/mystery-box/types";
import { SmallHeading } from "../Atoms";
import { PlayerAvatar } from "../PlayerAvatar";
import { BOX_COLORS } from "./MysteryBox";

type Props = {
  game: MysteryBoxGameView;
};

export const MysteryBoxRoundHistory = ({ game }: Props) => {
  //codepen.io/RoyLee0702/pen/RwNgVya
  https: return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {game.previousRounds.map((round) => {
        const bombBox = round.boxes.find(
          (box) => box.contents.type === "bomb"
        )!;

        return (
          <div
            key={round.id}
            style={{
              display: "flex",
              gap: "0.5rem",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              height: "20vh",
              border: "1px solid black",
              width: "10vw",
            }}
          >
            <SmallHeading style={{ textAlign: "center" }}>
              {round.id}
            </SmallHeading>
            <div
              style={{
                width: "2rem",
                height: "2rem",
                backgroundColor: BOX_COLORS[bombBox.id],
              }}
            />
            <div style={{ display: "flex", width: "100%", gap: "0.2rem" }}>
              {bombBox.playerIds.map((pid) => (
                <div key={pid} style={{ width: "1rem" }}>
                  <PlayerAvatar playerId={pid} size="tiny" />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
