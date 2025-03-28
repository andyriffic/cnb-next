import styled from "styled-components";
import { PlayerPageLayout } from "../../../PlayerPageLayout";
import { usePlayerGasGame } from "../hooks/usePlayerGasGame";
import { getOrdinal } from "../../../../utils/string";
import { SmallHeading } from "../../../Atoms";
import { PlayerGasCards } from "./PlayerGasCards";
import { PlayerGasTimeoutTimer } from "./PlayerGasTimeoutTimer";
import { PlayerGasCloudPresser } from "./PlayerGasCloudPresser";
import { PlayerGasNextOutSelector } from "./PlayerGasNextOutSelector";
import { PlayerGasChosenNextOutPlayer } from "./PlayerGasChosenNextOutPlayer";
import { PlayerSelectedCardInfo } from "./PlayerSelectedCardInfo";

const PlayerStatus = styled(SmallHeading)`
  margin: 2rem 0;
`;

const PlayerFinishedPosition = styled.div`
  margin: 2rem 0;
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
              Presses are doubled for all your current normal cards 😭
            </PlayerStatus>
          )}
          {gasPlayer.curse === "all-fives" && (
            <PlayerStatus>
              All your cards are reset to 5 presses 😭
            </PlayerStatus>
          )}
          {/* {playersTurn &&
            !game.currentPlayer.cardPlayed &&
            !!gasPlayer?.curse && (
              <PlayerGasTimeoutTimer
                timeOutMilliseconds={3000}
                onTimedOut={timeOut}
              />
            )} */}
        </>
      )}
      {game.currentPlayer.cardPlayed &&
        showCloudPresser &&
        gasPlayer.status === "alive" && (
          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            {/* <PlayerSelectedCardInfo card={game.currentPlayer.cardPlayed} /> */}
            <PlayerGasCloudPresser
              pressesRemaining={pressesRemaining}
              press={pressCloud}
            />
          </div>
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
            gasGame={game}
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
