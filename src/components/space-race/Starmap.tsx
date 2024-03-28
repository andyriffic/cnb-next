import styled from "styled-components";
import { SpaceRaceCoordinates, SpaceRaceStarmap } from "./types";
import { STARMAP_HEIGHT, STARMAP_WIDTH } from "./constants";
import { SpaceEntity } from "./SpaceEntity";

const Space = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  font-size: 5rem;
  background: url("/images/space-background-01.jpg") no-repeat;
  background-size: 100% 100%;
`;

const SpaceEntityContainer = styled.span`
  display: inline-block;
  position: absolute;
`;

type Props = {
  starmap: SpaceRaceStarmap;
};

// 🪐☄️🛸👽🛰️🚀

export const StarMap = ({ starmap }: Props) => {
  return (
    <Space>
      {starmap.entities.map((e, i) => (
        <SpaceEntityContainer key={i} style={getStarmapCssPosition(e.position)}>
          <SpaceEntity entity={e} />
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
