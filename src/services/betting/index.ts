import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";

import {
  BettingOption,
  GroupBettingGame,
  GroupPlayerBettingRound,
  PlayerBet,
  PlayerBettingRoundResult,
  PlayerWallet,
} from "./types";

export function createBettingGame(
  id: string,
  bettingOptions: BettingOption[],
  playerWallets: PlayerWallet[]
): E.Either<string, GroupBettingGame> {
  return E.right({
    id,
    rounds: [{ index: 0, bettingOptions, playerBets: [], playerResults: [] }],
    playerWallets,
  });
}

export function makePlayerBet(
  bettingGame: GroupBettingGame,
  playerBet: PlayerBet
): E.Either<string, GroupBettingGame> {
  return pipe(
    isValidBettingOption(playerBet.betOptionId, bettingGame),
    E.chain((betGame) =>
      playerHasAmountInWallet(playerBet.playerId, playerBet.betValue, betGame)
    ),
    E.chain((betGame) => playerHasNotBet(playerBet.playerId, betGame)),
    E.chain((betGame) => addPlayerBetToCurrentRound(playerBet, betGame))
  );
}

export function getBetResults(
  bettingRound: GroupPlayerBettingRound,
  winningOptionId: string
): PlayerBettingRoundResult[] {
  const winingOption = bettingRound.bettingOptions.find(
    (o) => o.id === winningOptionId
  )!;

  return bettingRound.playerBets.map((bet) => {
    const won = bet.betOptionId === winingOption.id;
    return {
      playerId: bet.playerId,
      totalWinnings: won ? bet.betValue * winingOption.odds : -bet.betValue,
    };
  });
}

function addPlayerBetToCurrentRound(
  playerBet: PlayerBet,
  bettingGame: GroupBettingGame
): E.Either<string, GroupBettingGame> {
  return pipe(
    getCurrentBettingRound(bettingGame),
    O.map(
      (round) =>
        ({
          ...round,
          playerBets: [...round.playerBets, playerBet],
        } as GroupPlayerBettingRound)
    ),
    O.map((updatedRound) => updateGroupBettingRound(updatedRound, bettingGame)),
    E.fromOption(() => "")
  );
}

function updateGroupBettingRound(
  round: GroupPlayerBettingRound,
  bettingGame: GroupBettingGame
): GroupBettingGame {
  return {
    ...bettingGame,
    rounds: bettingGame.rounds.map((r) =>
      r.index === round.index ? round : r
    ),
  };
}

function playerHasAmountInWallet(
  playerId: string,
  minAmount: number,
  bettingGame: GroupBettingGame
): E.Either<string, GroupBettingGame> {
  return pipe(
    bettingGame.playerWallets,
    A.findFirst((wallet) => wallet.playerId === playerId),
    O.match(
      () => E.left("No wallet found"),
      (wallet) =>
        wallet.value >= minAmount
          ? E.right(bettingGame)
          : E.left("Not enough in wallet")
    )
  );
}

function playerHasNotBet(
  playerId: string,
  bettingGame: GroupBettingGame
): E.Either<string, GroupBettingGame> {
  return pipe(
    getCurrentBettingRound(bettingGame),
    O.match(
      () => E.left("No current round"),
      (currentRound) =>
        pipe(
          currentRound.playerBets,
          A.findFirst((bet) => bet.playerId === playerId),
          O.match(
            () => E.right(bettingGame),
            () => E.left("Player has already bet this round")
          )
        )
    )
  );
}

function isValidBettingOption(
  optionId: string,
  bettingGame: GroupBettingGame
): E.Either<string, GroupBettingGame> {
  return pipe(
    getCurrentBettingRound(bettingGame),
    O.map((round) => round.bettingOptions),
    O.chain(A.findFirst((o) => o.id === optionId)),
    O.match(
      () => E.left("Invalid betting option"),
      () => E.right(bettingGame)
    )
  );
}

function getCurrentBettingRound(
  bettingGame: GroupBettingGame
): O.Option<GroupPlayerBettingRound> {
  return pipe(bettingGame.rounds, A.last);
}

function addPlayerBetToRound(
  bettingRound: GroupPlayerBettingRound,
  playerBet: PlayerBet
): GroupPlayerBettingRound {
  return {
    ...bettingRound,
    playerBets: [...bettingRound.playerBets, playerBet],
  };
}
