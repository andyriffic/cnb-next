import styled from "styled-components";
import { use, useCallback } from "react";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { MysteryBoxGameView } from "../../services/mystery-box/types";
import { selectRandomOneOf } from "../../utils/random";
import { BOX_COLORS, getBoxContents } from "./MysteryBox";

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

  const randomBoxSelection = useCallback(() => {
    game.players.forEach((p) => {
      if (p.status === "waiting") {
        const randomBox = selectRandomOneOf(game.currentRound.boxes);
        mysteryBox.playerSelectBox(
          game.id,
          p.id,
          game.currentRound.id,
          randomBox.id,
        );
      } else if (p.status === "eliminated") {
        const randomBox = selectRandomOneOf(game.currentRound.boxes);
        mysteryBox.eliminatedPlayerGuessBox(
          game.id,
          p.id,
          game.currentRound.id,
          randomBox.id,
        );
      }
    });
  }, [
    game.currentRound.boxes,
    game.currentRound.id,
    game.id,
    game.players,
    mysteryBox,
  ]);

  return (
    <div>
      <p>❓🎁</p>
      <div>
        <button type="button" onClick={() => mysteryBox.newRound(game.id)}>
          New Round
        </button>
      </div>

      <div style={{ display: "flex", gap: "2rem" }}>
        <div>
          <h3>Current Round</h3>
          <button type="button" onClick={randomBoxSelection}>
            Random box selection
          </button>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          {game.currentRound.boxes.map((box) => (
            <div
              key={box.id}
              style={{ backgroundColor: BOX_COLORS[box.id], padding: "0.5rem" }}
            >
              <p>{getBoxContents(box.contents)}</p>
            </div>
          ))}
        </div>
      </div>

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
                  const eliminatedAndGuessedThisBox =
                    p.status === "eliminated" &&
                    box.eliminatedPlayerIdsGuessingThisBox.includes(p.id);
                  return (
                    <BoxOptionContainerItem
                      key={box.id}
                      style={{
                        boxSizing: "border-box",
                        flexBasis: "0.5",
                        border:
                          selectedThisBox || eliminatedAndGuessedThisBox
                            ? "2px solid red"
                            : undefined,
                      }}
                    >
                      <button
                        type="button"
                        disabled={
                          eliminatedAndGuessedThisBox ||
                          selectedAnotherBox ||
                          selectedThisBox
                        }
                        style={{
                          display: "block",
                          backgroundColor: BOX_COLORS[box.id],
                          width: "100%",
                          height: "100%",
                        }}
                        onClick={() => {
                          if (p.status === "eliminated") {
                            mysteryBox.eliminatedPlayerGuessBox(
                              game.id,
                              p.id,
                              game.currentRound.id,
                              box.id,
                            );
                          } else {
                            mysteryBox.playerSelectBox(
                              game.id,
                              p.id,
                              game.currentRound.id,
                              box.id,
                            );
                          }
                        }}
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
