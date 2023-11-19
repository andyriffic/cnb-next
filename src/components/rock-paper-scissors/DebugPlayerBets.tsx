import { useState } from "react";
import styled from "styled-components";
import { useBettingGame } from "../../providers/SocketIoProvider/useGroupBetting";
import {
  BettingOption,
  GroupBettingGame,
  PlayerBet,
  PlayerWallet,
} from "../../services/betting/types";
import { selectRandomOneOf } from "../../utils/random";
import { RPSSpectatorGameView } from "../../services/rock-paper-scissors/types";
import { playerHasSpecialAdvantage } from "./rpsUtils";
import { useGameWinningConditions } from "./hooks/useGameWinningConditions";

const Container = styled.div`
  display: flex;
  gap: 1rem;
`;

type Props = {
  bettingGame: GroupBettingGame;
  rpsGameView: RPSSpectatorGameView;
};

export const DebugPlayerBets = ({ bettingGame, rpsGameView }: Props) => {
  const { makePlayerBet } = useBettingGame(bettingGame.id);
  const winningConditions = useGameWinningConditions(rpsGameView, bettingGame);

  const randomBets = () => {
    bettingGame.playerWallets.forEach((w) => {
      makePlayerBet({
        playerId: w.player.id,
        betValue: 0,
        betOptionId: selectRandomOneOf(bettingGame.currentRound.bettingOptions)
          .id,
      });
    });
  };

  return (
    <Container>
      <div>
        <button onClick={randomBets}>random bets</button>
      </div>

      {bettingGame.playerWallets.map((wallet) => {
        const specialPlayer = playerHasSpecialAdvantage(
          winningConditions,
          wallet.player.id
        );
        return (
          <div key={wallet.player.id}>
            <p>
              {wallet.player.id}: {wallet.value}
            </p>
            <div>
              <PlayersBettingOptions
                wallet={wallet}
                betOptions={bettingGame.currentRound.bettingOptions}
                makeBet={makePlayerBet}
                special={specialPlayer}
              />
              {/* <button onClick={() => makePlayerBet({ playerId })}>1</button> */}
            </div>
            {/* <div>
            <button
              onClick={() => makeMove({ playerId: pid, moveName: "rock" })}
            >
              🪨
            </button>
            <button
              onClick={() => makeMove({ playerId: pid, moveName: "paper" })}
            >
              📄
            </button>
            <button
              onClick={() => makeMove({ playerId: pid, moveName: "scissors" })}
            >
              ✂️
            </button>
          </div> */}
          </div>
        );
      })}
    </Container>
  );
};

function PlayersBettingOptions({
  wallet,
  betOptions,
  makeBet,
  special,
}: {
  wallet: PlayerWallet;
  betOptions: BettingOption[];
  makeBet: (playerBet: PlayerBet) => void;
  special: boolean;
}) {
  return (
    <div>
      {/* <div>
        <input
          type="number"
          min={1}
          max={wallet.value}
          value={betValue}
          onChange={(e) => setBetValue(e.target.valueAsNumber)}
        />
      </div> */}
      <div>
        {betOptions
          .filter((bo) => (bo.id !== "draw" ? true : special))
          .map((bo) => (
            <button
              key={bo.id}
              onClick={() =>
                makeBet({
                  playerId: wallet.player.id,
                  betValue: 0,
                  betOptionId: bo.id,
                })
              }
            >
              {bo.name}
            </button>
          ))}
      </div>
    </div>
  );
}
