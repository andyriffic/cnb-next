import { useEffect } from "react";
import { GasCard } from "../../../services/migrated/gas-out/types";
import { Appear } from "../../animations/Appear";
import { useSound } from "../../hooks/useSound";
import { BalloonCard } from "./Card";

type Props = {
  card: GasCard;
  pressesRemaining: number;
};

export function BalloonCardWithSoundAndAnimation({
  card,
  pressesRemaining,
}: Props): JSX.Element | null {
  const { play } = useSound();

  useEffect(() => {
    switch (card.type) {
      case "press":
        play("gas-play-number-card");
        break;
      case "reverse":
        play("gas-play-reverse-card");
        break;
      case "skip":
        play("gas-play-skip-card");
        break;
      case "risky":
      case "bomb":
        play("gas-play-risky-card");
        break;
      default:
        break;
    }
  }, [card.type, play]);

  if (card.type === "press" && pressesRemaining === 0) {
    return null;
  }
  return (
    <Appear animation="flip-in">
      <BalloonCard card={card} pressesRemaining={pressesRemaining} />
    </Appear>
  );
}
