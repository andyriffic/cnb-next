import { MysteryBoxGameRound } from "../../services/mystery-box/types";
import { SmallHeading } from "../Atoms";
import { MysteryBoxUi } from "./MysteryBox";

type Props = {
  round: MysteryBoxGameRound;
};

export const MysteryBoxCurrentRoundUi = ({ round }: Props) => {
  return (
    <>
      <SmallHeading>Round {round.id}</SmallHeading>
      {round.boxes.map((box) => {
        return <MysteryBoxUi key={box.id} box={box} />;
      })}
    </>
  );
};
