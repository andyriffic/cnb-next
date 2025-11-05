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
  return (
    <div style={{ display: "flex", gap: "0.5rem", height: "20vh" }}>
      {game.previousRounds
        .filter((r) => r.id > 0)
        .filter((r) => r.id !== game.currentRound.id)
        .map((round) => {
          const bombBoxs = round.boxes.filter(
            (box) => box.contents.type === "bomb"
          );

          return (
            <div
              key={round.id}
              style={{
                display: "flex",
                gap: "0.5rem",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                border: "1px solid black",
                width: "10vw",
              }}
            >
              <SmallHeading style={{ textAlign: "center" }}>
                {round.id}
              </SmallHeading>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {bombBoxs.map((box) => {
                  return (
                    <div
                      key={box.id}
                      style={{
                        width: "2rem",
                        height: "2rem",
                        backgroundColor: BOX_COLORS[box.id],
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      💣
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", width: "100%", gap: "0.2rem" }}>
                {bombBoxs
                  .flatMap((b) => b.playerIds)
                  .map((pid) => (
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
