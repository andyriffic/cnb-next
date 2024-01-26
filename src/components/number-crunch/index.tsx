import { useState } from "react";
import { NumberCrunchGameView } from "../../services/number-crunch/types";
import { SpectatorPageLayout } from "../SpectatorPageLayout";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { Card, SmallHeading } from "../Atoms";
import { SplashContent } from "../SplashContent";
import { DebugNumberCrunchGame } from "./DebugNumberCrunch";
import { FinalResults } from "./FinalResults";
import { NumberTarget } from "./NumberTarget";
import { RoundResultBuckets } from "./RoundResultBuckets";
import { WaitingToGuessList } from "./WaitingToGuessList";
import { useNumberCrunchGameSound } from "./hooks/useNumberCrunchGameSound";
import {
  NUMBER_CRUNCH_GAME_STATE,
  useNumberCrunchGameTiming,
} from "./hooks/useNumberCrunchGameTiming";

type Props = {
  game: NumberCrunchGameView;
};

const View = ({ game }: Props) => {
  const [revealWinner, setRevealWinner] = useState(false);
  const { numberCrunch } = useSocketIo();
  const gameState = useNumberCrunchGameTiming(game);

  const onRoundRevealed = () => {
    gameState.setState(NUMBER_CRUNCH_GAME_STATE.LATEST_ROUND_REVEALED);
  };

  useNumberCrunchGameSound(game, gameState.state);
  return (
    <SpectatorPageLayout debug={<DebugNumberCrunchGame game={game} />}>
      {/* <SmallHeading centered={true}>
        {NUMBER_CRUNCH_GAME_STATE[gameState.state]}
      </SmallHeading> */}
      {gameState.state <= NUMBER_CRUNCH_GAME_STATE.REVEAL_WINNER && (
        <>
          <NumberTarget game={game} />
          <WaitingToGuessList game={game} />
          <RoundResultBuckets
            gameView={game}
            gameState={gameState.state}
            onRoundRevealed={onRoundRevealed}
          />
        </>
      )}

      {game.finalResults &&
        gameState.state === NUMBER_CRUNCH_GAME_STATE.SHOW_RESULTS && (
          <FinalResults gameView={game} finalResults={game.finalResults} />
        )}
      {gameState.state === NUMBER_CRUNCH_GAME_STATE.START_NEW_ROUND && (
        <SplashContent>
          <Card>
            <SmallHeading>Keep trying</SmallHeading>
          </Card>
        </SplashContent>
      )}
    </SpectatorPageLayout>
  );
};

export default View;
