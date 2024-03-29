import { Player } from "../../types/Player";
import { Heading } from "../Atoms";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { StarMap } from "./Starmap";
import { STARMAP_CHART } from "./constants";
import { SpaceRacePlayer } from "./types";

const MOCK_PLAYERS: SpaceRacePlayer[] = [
  {
    id: "1",
    name: "Player 1",
    currentPosition: { x: 2, y: 3 },
    courseMovesRemaining: 0,
    plannedCourse: { up: 0, down: 0, right: 0 },
  },
];

type Props = {
  players: Player[];
};

const View = ({ players }: Props) => {
  return (
    <SpectatorPageLayout scrollable={false}>
      <StarMap starmap={STARMAP_CHART} players={MOCK_PLAYERS} />
    </SpectatorPageLayout>
  );
};

export default View;
