import { useCallback, useEffect, useMemo, useState } from "react";
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
import { LightBulb } from "./LightBulb";

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
  left: 50%;
  transform: translateX(-50%);
`;

type Props = {
  gasGame: GasGame;
  team: string | undefined;
};

const View = ({ gasGame, team }: Props) => {
  useGasSound(gasGame);
  const {
    gasGame: { nextPlayer, explodePlayer },
  } = useSocketIo();

  const nextPlayerForThisGame = useCallback(
    () => nextPlayer(gasGame.id),
    [gasGame, nextPlayer],
  );

  const [bombVictimId, setBombVictimId] = useState<string | undefined>();

  useEffect(() => {
    if (bombVictimId) {
      //TODO: explode current player and clear bomb victim
      const timeout = setTimeout(() => {
        explodePlayer(gasGame.id, bombVictimId);
        setBombVictimId(undefined);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [bombVictimId, explodePlayer, gasGame.id]);

  useEffect(() => {
    if (
      !!gasGame.winningPlayerId ||
      gasGame.globalEffect?.type === "random-explode"
    ) {
      return;
    }

    if (
      (gasGame.currentPlayer.cardPlayed &&
        gasGame.currentPlayer.pressesRemaining <= 0) ||
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
          <LightBulb
            state={gasGame.globalEffect?.type === "lights-out" ? "off" : "on"}
          />
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
              forcePlayerId={bombVictimId}
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
          <TalkingHeadBalloon gasCloud={gasGame.gasCloud} />
          {/* <GasBallon gasCloud={gasGame.gasCloud} /> */}
        </BalloonContainer>

        <GraveyardContainer>
          <Graveyard game={gasGame} />
        </GraveyardContainer>
        {gasGame.globalEffect?.type === "random-explode" && (
          <BombDisposalChoice
            game={gasGame}
            onPlayerSelected={(playerId) => setBombVictimId(playerId)}
          />
        )}
      </Container>
    </SpectatorPageLayout>
  );
};

export default View;
