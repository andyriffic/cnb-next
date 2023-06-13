import styled from "styled-components";
import { PlayerPageLayout } from "../../../PlayerPageLayout";
import { usePlayerGasGame } from "../hooks/usePlayerGasGame";
import { getOrdinal } from "../../../../utils/string";
import { PlayerGasCards } from "./PlayerGasCards";
import { PlayerGasTimeoutTimer } from "./PlayerGasTimeoutTimer";
import { PlayerGasCloudPresser } from "./PlayerGasCloudPresser";
import { PlayerGasNextOutSelector } from "./PlayerGasNextOutSelector";
import { PlayerGasChosenNextOutPlayer } from "./PlayerGasChosenNextOutPlayer";

const PlayerStatus = styled.div`
  margin: 30px 0;
  text-align: center;
  font-size: 2rem;
`;

const PlayerFinishedPosition = styled.div`
  margin: 30px 0;
  text-align: center;
  font-size: 3rem;
`;

type Props = {
  playerId: string;
  gasGameId: string;
};

const View = ({ playerId, gasGameId }: Props) => {
  const {
    game,
    gasPlayer,
    playersTurn,
    playPlayersCard,
    pressesRemaining,
    pressCloud,
    statusText,
    guessNextPlayerOut,
    timeOut,
  } = usePlayerGasGame(playerId, gasGameId);

  if (!(gasPlayer && game)) {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }

  const showCloudPresser = playersTurn && pressesRemaining > 0;

  return (
    <PlayerPageLayout playerId={playerId}>
      <PlayerStatus>{statusText}</PlayerStatus>
      {!showCloudPresser && gasPlayer.status === "alive" && (
        <>
          <PlayerGasCards
            cards={gasPlayer.cards}
            enabled={playersTurn && !game.currentPlayer.cardPlayed}
            playCard={playPlayersCard}
            player={gasPlayer}
          />
          {gasPlayer.curse === "double-press" && (
            <PlayerStatus>
              Presses are doubled for your turn, and you must pick a number card
              😭
            </PlayerStatus>
          )}
          {playersTurn &&
            !game.currentPlayer.cardPlayed &&
            !!gasPlayer?.curse && (
              <PlayerGasTimeoutTimer
                timeOutMilliseconds={3000}
                onTimedOut={timeOut}
              />
            )}
        </>
      )}
      {showCloudPresser && gasPlayer.status === "alive" && (
        <PlayerGasCloudPresser
          pressesRemaining={pressesRemaining}
          press={pressCloud}
        />
      )}
      {!!gasPlayer.finishedPosition && (
        <PlayerFinishedPosition>
          <>{getOrdinal(gasPlayer.finishedPosition)}</>
        </PlayerFinishedPosition>
      )}
      {!gasPlayer.guesses.nextPlayerOutGuess &&
        !game.winningPlayerId &&
        gasPlayer.status === "dead" && (
          <PlayerGasNextOutSelector
            eligiblePlayers={game.allPlayers.filter(
              (p) => p.status === "alive"
            )}
            selectPlayer={guessNextPlayerOut}
          />
        )}
      {gasPlayer.guesses.nextPlayerOutGuess && (
        <PlayerGasChosenNextOutPlayer
          allPlayers={game.allPlayers}
          selectedPlayerId={gasPlayer.guesses.nextPlayerOutGuess}
        />
      )}
    </PlayerPageLayout>
  );
};

export default View;
