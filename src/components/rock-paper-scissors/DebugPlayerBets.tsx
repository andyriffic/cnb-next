import { useState } from "react";
import styled from "styled-components";
import { useBettingGame } from "../../providers/SocketIoProvider/useGroupBetting";
import { useRPSGame } from "../../providers/SocketIoProvider/useRockPaperScissorsSocket";
import {
  BettingOption,
  GroupBettingGame,
  PlayerBet,
  PlayerWallet,
} from "../../services/betting/types";

const Container = styled.div`
  display: flex;
  gap: 1rem;
`;

type Props = {
  bettingGame: GroupBettingGame;
};

export const DebugPlayerBets = ({ bettingGame }: Props) => {
  const { makePlayerBet } = useBettingGame(bettingGame.id);

  return (
    <Container>
      {bettingGame.playerWallets.map((wallet) => (
        <div key={wallet.playerId}>
          <p>
            {wallet.playerId}: {wallet.value}🍒
          </p>
          <div>
            <PlayersBettingOptions
              wallet={wallet}
              betOptions={
                bettingGame.rounds[bettingGame.rounds.length - 1]!
                  .bettingOptions
              }
              makeBet={makePlayerBet}
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
      ))}
    </Container>
  );
};

function PlayersBettingOptions({
  wallet,
  betOptions,
  makeBet,
}: {
  wallet: PlayerWallet;
  betOptions: BettingOption[];
  makeBet: (playerBet: PlayerBet) => void;
}) {
  const [betValue, setBetValue] = useState(1);
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
        {betOptions.map((bo) => (
          <button
            key={bo.id}
            onClick={() =>
              makeBet({
                playerId: wallet.playerId,
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
