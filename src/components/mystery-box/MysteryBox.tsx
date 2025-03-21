import {
  MysteryBox,
  MysteryBoxContents,
} from "../../services/mystery-box/types";
import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { SmallHeading } from "../Atoms";

type Props = {
  box: MysteryBox;
};

export const MysteryBoxUi = ({ box }: Props) => {
  //codepen.io/RoyLee0702/pen/RwNgVya
  https: return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <SmallHeading style={{ textAlign: "center" }}>
        {box.id} : {box.contents.type} - {box.contents.value}
      </SmallHeading>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {box.playerIds.map((pid) => (
          <p key={pid}>{pid}</p>
        ))}
      </div>
    </div>
  );
};
