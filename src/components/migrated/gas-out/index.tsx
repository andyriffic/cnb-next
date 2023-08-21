import { useCallback, useEffect } from "react";
import styled from "styled-components";
import { useSocketIo } from "../../../providers/SocketIoProvider";
import { GasGame } from "../../../services/migrated/gas-out/types";
import { LinkToMiniGame } from "../../LinkToMiniGame";
import { SpectatorPageLayout } from "../../SpectatorPageLayout";
import { FinalPodium } from "./FinalPodium";
import { GasBallon } from "./GasBalloon";
import { GasPlayerDebug } from "./GasPlayerDebug";
import { Graveyard } from "./Graveyard";
import { LastTwoPlayersNotification } from "./LastTwoPlayersNotification";
import { PlayerCarousel } from "./PlayerCarousel";
import { useGasSound } from "./hooks/useGasSound";

const Container = styled.div`
  margin: 50px auto;
`;

const GameModeDisplay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  text-transform: uppercase;
  padding: 1rem;
`;

const CarouselContainer = styled.div`
  margin-top: 200px;
`;

const BalloonContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const GraveyardContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 25%;
`;

type Props = {
  gasGame: GasGame;
  team: string | undefined;
};

const View = ({ gasGame, team }: Props) => {
  useGasSound(gasGame);
  const {
    gasGame: { nextPlayer },
  } = useSocketIo();

  const nextPlayerForThisGame = useCallback(
    () => nextPlayer(gasGame.id),
    [gasGame, nextPlayer]
  );

  useEffect(() => {
    if (!!gasGame.winningPlayerId) {
      return;
    }

    if (
      (gasGame.currentPlayer.cardPlayed &&
        gasGame.currentPlayer.pressesRemaining === 0) ||
      gasGame.gasCloud.exploded
    ) {
      const timeout = gasGame.gasCloud.exploded ? 1500 : 1000;
      const timer = setTimeout(nextPlayerForThisGame, timeout);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [gasGame, nextPlayerForThisGame]);

  return (
    <SpectatorPageLayout
      scrollable={false}
      debug={<GasPlayerDebug game={gasGame} />}
    >
      <Container>
        <GameModeDisplay>{gasGame.gameType} mode</GameModeDisplay>
        {!gasGame.winningPlayerId && (
          <CarouselContainer>
            <PlayerCarousel
              game={gasGame}
              gameOver={!!gasGame.winningPlayerId}
            />
          </CarouselContainer>
        )}
        {/* <Winner game={game} /> */}
        {!!gasGame.winningPlayerId && <FinalPodium game={gasGame} />}
        {!!gasGame.winningPlayerId && <LinkToMiniGame />}
        <LastTwoPlayersNotification game={gasGame} />
        <BalloonContainer>
          <GasBallon gasCloud={gasGame.gasCloud} />
        </BalloonContainer>

        <GraveyardContainer>
          <Graveyard game={gasGame} />
        </GraveyardContainer>
      </Container>
    </SpectatorPageLayout>
  );
};

export default View;
