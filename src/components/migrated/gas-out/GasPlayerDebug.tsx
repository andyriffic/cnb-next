import React from "react";
import styled, { css } from "styled-components";
import { GasGame, GasPlayer } from "../../../services/migrated/gas-out/types";
import { useSocketIo } from "../../../providers/SocketIoProvider";

const getAlivePlayers = (game: GasGame): GasPlayer[] => {
  return game.allPlayers.filter((p) => p.status === "alive");
};

const PlayerListContainer = styled.div`
  /* position: absolute;
  top: 0;
  right: 0; */
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const PlayerListItem = styled.div<{ active: boolean }>`
  ${({ active }) =>
    active &&
    css`
      background-color: blue;
    `}
`;

type Props = {
  game: GasGame;
};

export function GasPlayerDebug({ game }: Props): JSX.Element {
  const {
    gasGame: { playCard, pressGas, guessNextOutPlayer, playEffect },
  } = useSocketIo();
  const activePlayers = game.allPlayers.filter((p) => p.status !== "dead");
  return (
    <PlayerListContainer>
      {game.allPlayers.map((p) => {
        const active = p.player.id === game.currentPlayer.id;
        return (
          <PlayerListItem
            key={p.player.id}
            active={p.player.id === game.currentPlayer.id}
          >
            {p.player.name}
            <div>
              {p.cards.map((c, i) => (
                <button
                  disabled={!active || !!game.currentPlayer.cardPlayed}
                  key={i}
                  onClick={() => playCard(game.id, p.player.id, i)}
                >
                  ({c.type === "press" ? c.presses : c.type})
                </button>
              ))}
              {p.effectPower && (
                <button
                  onClick={() =>
                    playEffect(game.id, {
                      type: p.effectPower!,
                      playedByPlayerId: p.player.id,
                    })
                  }
                >
                  {p.effectPower}
                </button>
              )}
              {active && game.currentPlayer.pressesRemaining > 0 && (
                <button onClick={() => pressGas(game.id)}>PRESS!</button>
              )}
              {p.guesses.nextPlayerOutGuess && (
                <p
                  style={{
                    padding: "0 2px",
                    margin: 0,
                    fontSize: "0.6rem",
                  }}
                >
                  NEXT OUT: {p.guesses.nextPlayerOutGuess}
                </p>
              )}
              <div>
                {p.status === "dead" &&
                  !game.winningPlayerId &&
                  !p.guesses.nextPlayerOutGuess && (
                    <div>
                      <p
                        style={{
                          padding: "0 2px",
                          margin: 0,
                          fontSize: "0.6rem",
                        }}
                      >
                        GUESS:
                      </p>
                      {getAlivePlayers(game).map((dp) => {
                        return (
                          <button
                            key={`${p.player.id}-guess-${dp.player.id}`}
                            onClick={() =>
                              guessNextOutPlayer(
                                game.id,
                                p.player.id,
                                dp.player.id
                              )
                            }
                          >
                            {dp.player.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
              </div>
            </div>
          </PlayerListItem>
        );
      })}
    </PlayerListContainer>
  );
}
