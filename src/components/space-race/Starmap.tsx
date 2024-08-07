import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { isClientSideFeatureEnabled } from "../../utils/feature";
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
  // border: 1px solid #ccc;
`;

const SpacePlayerContainer = styled.span`
  display: inline-block;
  position: absolute;
  transition: top 0.5s, left 0.5s;
`;

const GridLine = styled.div`
  position: absolute;
  background-color: #333;
  opacity: 0.6;
`;

const HorizontalGridLine = styled(GridLine)`
  left: 0;
  width: 100vw;
  height: 2px;
`;

const VerticalGridLine = styled(GridLine)`
  top: 0;
  width: 2px;
  height: 100vh;
`;

const DebugCoordinates = styled.span`
  font-size: 0.9rem;
  text-align: center;
  opacity: 0.3;
`;

type Props = {
  starmap: SpaceRaceStarmap;
  players: SpacePlayersById;
};

export const StarMap = ({ starmap, players }: Props) => {
  const [showDebug, setShowDebug] = useState(false);
  useEffect(() => setShowDebug(isClientSideFeatureEnabled("debug")), []);

  return (
    <Space>
      {Array(STARMAP_HEIGHT)
        .fill(0)
        .map((_, i) => (
          <HorizontalGridLine
            key={i}
            style={{
              top: `${(100 / STARMAP_HEIGHT) * i}vh`,
            }}
          />
        ))}
      {Array(STARMAP_WIDTH)
        .fill(0)
        .map((_, i) => (
          <VerticalGridLine
            key={i}
            style={{
              left: `${(100 / STARMAP_WIDTH) * i}vw`,
            }}
          />
        ))}
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
      {showDebug &&
        starmapDebugCoordinates().map((position, i) => (
          <SpaceEntityContainer key={i} style={getStarmapCssPosition(position)}>
            <DebugCoordinates>{`(${position.x}, ${position.y})`}</DebugCoordinates>
          </SpaceEntityContainer>
        ))}
    </Space>
  );
};

function starmapDebugCoordinates() {
  const coordinates: SpaceRaceCoordinates[] = [];
  for (let y = 0; y < STARMAP_HEIGHT; y++) {
    for (let x = 0; x < STARMAP_WIDTH; x++) {
      coordinates.push({ x, y });
    }
  }
  return coordinates;
}

function getStarmapCssPosition(position: SpaceRaceCoordinates) {
  return {
    top: `${(100 / STARMAP_HEIGHT) * position.y}vh`,
    left: `${(100 / STARMAP_WIDTH) * position.x}vw`,
  };
}
