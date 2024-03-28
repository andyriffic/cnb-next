import { Player } from "../../types/Player";
import { Heading } from "../Atoms";
import { SpectatorPageLayout } from "../SpectatorPageLayout";

type Props = {
  players: Player[];
};

const View = ({ players }: Props) => {
  return (
    <SpectatorPageLayout scrollable={false}>
      <Heading style={{ textAlign: "center" }}>🪐 Space Race 🚀</Heading>
    </SpectatorPageLayout>
  );
};

export default View;
