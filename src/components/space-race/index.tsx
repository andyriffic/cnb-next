import { Player } from "../../types/Player";
import { Heading } from "../Atoms";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { StarMap } from "./Starmap";
import { STARMAP_CHART } from "./constants";

type Props = {
  players: Player[];
};

const View = ({ players }: Props) => {
  return (
    <SpectatorPageLayout scrollable={false}>
      <StarMap starmap={STARMAP_CHART} />
    </SpectatorPageLayout>
  );
};

export default View;
