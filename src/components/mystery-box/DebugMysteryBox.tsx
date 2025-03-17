import styled from "styled-components";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { MysteryBoxGame } from "../../services/mystery-box/types";

const BoxOptionContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-row: auto auto;
  grid-column-gap: 0.2rem;
  grid-row-gap: 0.2rem;
`;
const BoxOptionContainerItem = styled.div``;

type Props = {
  game: MysteryBoxGame;
};

export const DebugMysteryBoxGame = ({ game }: Props) => {
  const { mysteryBox } = useSocketIo();

  const currentRound = game.rounds.find((r) => r.id === game.currentRoundId);

  if (!currentRound) {
    return <p>No current round</p>;
  }

  return (
    <div>
      <p>❓🎁</p>
      <h3>Current Round</h3>

      <div style={{ display: "flex", gap: "2rem" }}>
        {game.players.map((p) => {
          return (
            <div key={p.id}>
              <p>{p.name}</p>
              <BoxOptionContainer>
                {currentRound.boxes.map((box) => {
                  const selectedThisBox = box.playerIds.includes(p.id);
                  const selectedAnotherBox = currentRound.boxes
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
                        disabled={selectedAnotherBox || selectedThisBox}
                        style={{ display: "block" }}
                        onClick={() =>
                          mysteryBox.playerSelectBox(
                            game.id,
                            p.id,
                            currentRound.id,
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
