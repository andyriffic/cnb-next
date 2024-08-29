import styled from "styled-components";
import { fadeInAnimation } from "../animations/keyframes/fade";
import { STARMAP_HEIGHT, STARMAP_WIDTH } from "./constants";
import { SpacePlayersById, SpaceRaceEntity } from "./types";

const Container = styled.div`
  font-size: 3rem;
  width: ${100 / STARMAP_WIDTH}vw;
  height: ${100 / STARMAP_HEIGHT}vh;
  // border: 1px solid red;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Signpost = styled.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  position: absolute;
  top: 0;
  left: 0;
  border: 2px solid #ccc;
  background: darkgreen;
  padding: 0.2rem;
  text-align: center;
  border-radius: 0.5rem 0.5rem 0 0;
  animation: ${fadeInAnimation} 500ms ease-out 400ms 1 both;
`;

type Props = {
  entity: SpaceRaceEntity;
  players: SpacePlayersById;
};

export const SpaceEntity = ({ entity, players }: Props) => {
  const colonisedEarthPlayer = Object.values(players).find((player) => {
    return (
      player.currentPosition.x === entity.position.x &&
      player.currentPosition.y === entity.position.y
    );
  });
  return colonisedEarthPlayer ? (
    <Container>
      {entity.display}
      <Signpost>
        Planet{" "}
        <span style={{ fontWeight: "bold" }}>{colonisedEarthPlayer.name}</span>
      </Signpost>
    </Container>
  ) : (
    <Container>{entity.display}</Container>
  );
};
