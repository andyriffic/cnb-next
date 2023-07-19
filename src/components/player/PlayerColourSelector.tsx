import { useEffect, useState } from "react";
import { SwatchesPicker } from "react-color";
import { Player } from "../../types/Player";
import { SubHeading } from "../Atoms";
import { PacManGhost } from "../pacman/PacManGhost";
import { updatePlayerDetails } from "../../utils/api";

type Props = {
  player: Player;
};

export const PlayerColourSelector = ({ player }: Props) => {
  const [selectedColour, setSelectedColour] = useState(
    player.details?.colourHex || "#FF0000"
  );

  useEffect(() => {
    updatePlayerDetails(player.id, { colourHex: selectedColour });
  }, [player.id, selectedColour]);

  console.log("selectedColour", selectedColour);

  return (
    <div>
      <SubHeading>Your colour 你的颜色</SubHeading>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "1rem 0" }}
      >
        <PacManGhost color={selectedColour} width="25vw" />
      </div>

      <SwatchesPicker
        color={selectedColour}
        onChangeComplete={(color) => setSelectedColour(color.hex)}
      />
    </div>
  );
};
