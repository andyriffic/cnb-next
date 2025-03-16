import { useSocketIo } from "../../providers/SocketIoProvider";
import { MysteryBoxGame } from "../../services/mystery-box/types";
import { NumberCrunchGameView } from "../../services/number-crunch/types";

type Props = {
  game: MysteryBoxGame;
};

export const DebugMysteryBoxGame = ({ game }: Props) => {
  const { mysteryBox } = useSocketIo();

  return <>❓🎁 DEBUG...</>;
};
