import styled from "styled-components";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { MysteryBoxGameView } from "../../services/mystery-box/types";

const BoxOptionContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-row: auto auto;
  grid-column-gap: 0.2rem;
  grid-row-gap: 0.2rem;
`;
const BoxOptionContainerItem = styled.div``;

type Props = {
  game: MysteryBoxGameView;
};

export const DebugMysteryBoxGame = ({ game }: Props) => {
  const { mysteryBox } = useSocketIo();

  return (
    <div>
      <p>❓🎁</p>
      <div>
        <button type="button" onClick={() => mysteryBox.newRound(game.id)}>
          New Round
        </button>
      </div>
      <h3>Current Round</h3>

      <div style={{ display: "flex", gap: "2rem" }}>
        {game.players.map((p) => {
          return (
            <div
              key={p.id}
              style={{ opacity: p.status === "eliminated" ? 0.5 : 1 }}
            >
              <p
                style={{
                  textDecoration:
                    p.status === "eliminated" ? "line-through" : "unset",
                }}
              >
                {p.name}
              </p>
              <BoxOptionContainer>
                {game.currentRound.boxes.map((box) => {
                  const selectedThisBox = box.playerIds.includes(p.id);
                  const selectedAnotherBox = game.currentRound.boxes
                    .flatMap((b) => b.playerIds)
                    .includes(p.id);
                  return (
                    <BoxOptionContainerItem
                      key={box.id}
                      style={{
                        boxSizing: "border-box",
                        flexBasis: "0.5",
                        border: selectedThisBox ? "2px solid red" : undefined,
                      }}
                    >
                      <button
                        type="button"
                        disabled={
                          selectedAnotherBox ||
                          selectedThisBox ||
                          p.status === "eliminated"
                        }
                        style={{ display: "block" }}
                        onClick={() =>
                          mysteryBox.playerSelectBox(
                            game.id,
                            p.id,
                            game.currentRound.id,
                            box.id
                          )
                        }
                      >
                        🎁
                      </button>
                    </BoxOptionContainerItem>
                  );
                })}
              </BoxOptionContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
};
