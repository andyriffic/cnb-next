import { useCallback, useEffect, useMemo } from "react";
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
import { AnimatedText, SuperGuess } from "./SuperGuess";
import { useGasSound } from "./hooks/useGasSound";
import { TalkingHeadBalloon } from "./TalkingHeadBalloon";
import { FinalShowdown } from "./FinalShowdown";
import { BombDisposalChoice } from "./BombDisposalChoice";

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

const SuperGuessDisplay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 2rem;
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
    if (
      !!gasGame.winningPlayerId ||
      gasGame.globalEffect?.type === "random-explode"
    ) {
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

  const lastTwoPlayers = useMemo(() => {
    return gasGame.allPlayers.filter((p) => p.status === "alive").length === 2;
  }, [gasGame.allPlayers]);

  return (
    <SpectatorPageLayout
      scrollable={false}
      debug={<GasPlayerDebug game={gasGame} />}
    >
      <Container>
        <GameModeDisplay>
          {gasGame.gameType === "crazy" ? (
            <AnimatedText>Crazy mode</AnimatedText>
          ) : (
            `${gasGame.gameType} mode`
          )}
        </GameModeDisplay>
        {gasGame.superGuessInEffect && (
          <SuperGuessDisplay>
            <SuperGuess />
          </SuperGuessDisplay>
        )}
        {!gasGame.winningPlayerId && !lastTwoPlayers && (
          <CarouselContainer>
            <PlayerCarousel
              game={gasGame}
              gameOver={!!gasGame.winningPlayerId}
            />
          </CarouselContainer>
        )}
        {lastTwoPlayers && (
          <FinalShowdown game={gasGame} gameOver={!!gasGame.winningPlayerId} />
        )}
        {/* <Winner game={game} /> */}
        {!!gasGame.winningPlayerId && <FinalPodium game={gasGame} />}
        {!!gasGame.winningPlayerId && <LinkToMiniGame />}
        <LastTwoPlayersNotification game={gasGame} />
        <BalloonContainer>
          {/* <TalkingHeadBalloon gasCloud={gasGame.gasCloud} /> */}
          <GasBallon gasCloud={gasGame.gasCloud} />
        </BalloonContainer>

        <GraveyardContainer>
          <Graveyard game={gasGame} />
        </GraveyardContainer>
        {gasGame.globalEffect?.type === "random-explode" && (
          <BombDisposalChoice game={gasGame} />
        )}
      </Container>
    </SpectatorPageLayout>
  );
};

export default View;
