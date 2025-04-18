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
              height: "20vh",
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
            <div>
              {bombBox.playerIds.map((pid) => (
                <PlayerAvatar key={pid} playerId={pid} size="tiny" />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
