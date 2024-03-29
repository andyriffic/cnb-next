import styled from "styled-components";
import {
  SpaceRaceCoordinates,
  SpaceRacePlayer,
  SpaceRaceStarmap,
} from "./types";
import { STARMAP_HEIGHT, STARMAP_WIDTH } from "./constants";
import { SpaceEntity } from "./SpaceEntity";
import { PlayerShip } from "./PlayerShip";

const Space = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  font-size: 5rem;
  background-image: url("/images/space-background-01.jpg");
  background-size: 100% 100%;
`;

const SpaceEntityContainer = styled.span`
  display: inline-block;
  position: absolute;
`;

type Props = {
  starmap: SpaceRaceStarmap;
  players: SpaceRacePlayer[];
};

export const StarMap = ({ starmap, players }: Props) => {
  return (
    <Space>
      {starmap.entities.map((e, i) => (
        <SpaceEntityContainer key={i} style={getStarmapCssPosition(e.position)}>
          <SpaceEntity entity={e} />
        </SpaceEntityContainer>
      ))}
      {players.map((p, i) => (
        <SpaceEntityContainer
          key={i}
          style={getStarmapCssPosition(p.currentPosition)}
        >
          <PlayerShip player={p} />
        </SpaceEntityContainer>
      ))}
    </Space>
  );
};

function getStarmapCssPosition(position: SpaceRaceCoordinates) {
  return {
    top: `${(100 / STARMAP_HEIGHT) * position.y}vh`,
    left: `${(100 / STARMAP_WIDTH) * position.x}vw`,
  };
}
