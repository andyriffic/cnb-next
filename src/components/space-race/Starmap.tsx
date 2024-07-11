import styled from "styled-components";
import {
  SpacePlayersById,
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
  border: 1px solid #ccc;
`;

const SpacePlayerContainer = styled.span`
  display: inline-block;
  position: absolute;
  transition: top 0.5s, left 0.5s;
`;

type Props = {
  starmap: SpaceRaceStarmap;
  players: SpacePlayersById;
};

export const StarMap = ({ starmap, players }: Props) => {
  return (
    <Space>
      {starmap.entities.map((e, i) => (
        <SpaceEntityContainer key={i} style={getStarmapCssPosition(e.position)}>
          <SpaceEntity entity={e} />
        </SpaceEntityContainer>
      ))}
      {Object.keys(players).map((playerId, i) => {
        const player = players[playerId];
        if (!player) return null;
        return (
          <SpacePlayerContainer
            key={i}
            style={getStarmapCssPosition(player.currentPosition)}
          >
            <PlayerShip player={player} />
          </SpacePlayerContainer>
        );
      })}
    </Space>
  );
};

function getStarmapCssPosition(position: SpaceRaceCoordinates) {
  return {
    top: `${(100 / STARMAP_HEIGHT) * position.y}vh`,
    left: `${(100 / STARMAP_WIDTH) * position.x}vw`,
  };
}
