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
  return (
    <>
      <SmallHeading style={{ textAlign: "center" }}>
        {box.id} : {box.contents.type} - {box.contents.value}
      </SmallHeading>
    </>
  );
};
