import styled from "styled-components";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { FeatureHeading } from "../Atoms";
import { SpacePlayersById, SpaceRaceStarmap } from "./types";

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

const FeatureHeadingContainer = styled.div`
  position: abosulte;
  left: 50%;
  top: 50%;
  // transform: translate3d(-50%, -50%, 0);
`;

type Props = {
  starmap: SpaceRaceStarmap;
  players: SpacePlayersById;
};

export const ComingSoon = () => {
  return (
    <SpectatorPageLayout>
      <Space>
        <FeatureHeadingContainer>
          <FeatureHeading>Coming soon</FeatureHeading>
        </FeatureHeadingContainer>
      </Space>
    </SpectatorPageLayout>
  );
};
