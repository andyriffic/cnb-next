import styled from "styled-components";
import { NumberCrunchGame } from "../../services/number-crunch/types";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { SmallHeading } from "../Atoms";
import { WaitingToGuessList } from "./WaitingToGuessList";

type Props = {
  game: NumberCrunchGame;
};

const View = ({ game }: Props) => {
  return (
    <SpectatorPageLayout>
      <SmallHeading>Found game {game.id}</SmallHeading>
      <WaitingToGuessList game={game} />
    </SpectatorPageLayout>
  );
};

export default View;
