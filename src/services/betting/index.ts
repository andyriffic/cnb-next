import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";

import {
  BettingOption,
  GroupBettingGame,
  GroupPlayerBettingRound,
  PlayerBet,
  PlayerWallet,
} from "./types";

export function createBettingGame(
  id: string,
  bettingOptions: BettingOption[],
  playerWallets: PlayerWallet[]
): E.Either<string, GroupBettingGame> {
  return E.right({
    id,
    currentRound: { bettingOptions, playerBets: [] },
    roundHistory: [],
    playerWallets,
  } as GroupBettingGame);
}

export function makePlayerBet(
  bettingGame: GroupBettingGame,
  playerBet: PlayerBet
): E.Either<string, GroupBettingGame> {
  return pipe(
    isValidBettingOption(playerBet.betOptionId, bettingGame),
    E.chain((betGame) => playerHasAmountInWallet(playerBet, betGame)),
    E.chain((betGame) => playerHasNotBet(playerBet.playerId, betGame)),
    E.map((betGame) => addPlayerBetToCurrentRound(playerBet, betGame))
  );
}

export function applyBetResultToCurrentRound(
  bettingGame: GroupBettingGame,
  winningOptionId: string
): E.Either<string, GroupBettingGame> {
  return pipe(
    applyResultToBettingRound(bettingGame.currentRound, winningOptionId),
    E.map((updatedRound) => updateGroupBettingRound(updatedRound, bettingGame)),
    E.map(updatePlayerWalletsWithRoundResult)
  );
}

export function addNewBettingRound(
  bettingGame: GroupBettingGame
): E.Either<string, GroupBettingGame> {
  return pipe(
    checkCurrentRoundHasBetResult(bettingGame),
    E.map(addBettingRoundWithPreviousRoundBettingOptions)
  );
}

function updatePlayerWalletsWithRoundResult({
  round,
  bettingGame,
}: {
  round: GroupPlayerBettingRound;
  bettingGame: GroupBettingGame;
}): GroupBettingGame {
  const bettingResult = round.result!;
  return {
    ...bettingGame,
    playerWallets: bettingGame.playerWallets.map((wallet) => {
      const betResult = bettingResult.playerResults.find(
        (r) => r.playerId === wallet.playerId
      );
      if (!betResult) {
        return wallet;
      }

      return {
        ...wallet,
        value: wallet.value + betResult.totalWinnings,
      };
    }),
  };
}

function getBetWinnings(betOption: BettingOption, betValue: number): number {
  switch (betOption.betReturn) {
    case "oddsOnly": {
      return betOption.odds;
    }
    case "multiply":
    default: {
      return betOption.odds * betValue;
    }
  }
}

function applyResultToBettingRound(
  bettingRound: GroupPlayerBettingRound,
  winningOptionId: string
): E.Either<string, GroupPlayerBettingRound> {
  const winingOption = bettingRound.bettingOptions.find(
    (o) => o.id === winningOptionId
  );

  if (!winingOption) {
    return E.left(`Winning option "${winningOptionId}" not found`);
  }

  return E.right({
    ...bettingRound,
    result: {
      winningOptionId,
      playerResults: bettingRound.playerBets.map((bet) => {
        const won = bet.betOptionId === winingOption.id;
        return {
          playerId: bet.playerId,
          totalWinnings: won
            ? getBetWinnings(winingOption, bet.betValue)
            : -bet.betValue,
        };
      }),
    },
  } as GroupPlayerBettingRound);
}

function checkCurrentRoundHasBetResult(
  bettingGame: GroupBettingGame
): E.Either<string, GroupBettingGame> {
  return pipe(
    O.fromNullable(bettingGame.currentRound.result),
    O.match(
      () => E.left("Current round does not have result"),
      () => E.right(bettingGame)
    )
  );
}

function addPlayerBetToCurrentRound(
  playerBet: PlayerBet,
  bettingGame: GroupBettingGame
): GroupBettingGame {
  return pipe(
    bettingGame.currentRound,
    (round): GroupPlayerBettingRound => ({
      ...round,
      playerBets: [...round.playerBets, playerBet],
    }),
    (updatedRound) => updateGroupBettingRound(updatedRound, bettingGame),
    (result) => result.bettingGame
  );
}

function updateGroupBettingRound(
  round: GroupPlayerBettingRound,
  bettingGame: GroupBettingGame
): { round: GroupPlayerBettingRound; bettingGame: GroupBettingGame } {
  return {
    round,
    bettingGame: {
      ...bettingGame,
      currentRound: round,
    },
  };
}

function playerHasAmountInWallet(
  playerBet: PlayerBet,
  bettingGame: GroupBettingGame
): E.Either<string, GroupBettingGame> {
  return pipe(
    bettingGame.playerWallets,
    A.findFirst((wallet) => wallet.playerId === playerBet.playerId),
    O.match(
      () => E.left("No wallet found"),
      (wallet) =>
        wallet.value >= playerBet.betValue
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
    bettingGame.currentRound,
    (currentRound) => currentRound.playerBets,
    A.findFirst((bet) => bet.playerId === playerId),
    O.match(
      () => E.right(bettingGame),
      () => E.left("Player has already bet this round")
    )
  );
}

function isValidBettingOption(
  optionId: string,
  bettingGame: GroupBettingGame
): E.Either<string, GroupBettingGame> {
  return pipe(
    bettingGame.currentRound,
    (currentRound) => currentRound.bettingOptions,
    A.findFirst((o) => o.id === optionId),
    O.match(
      () => E.left("Invalid betting option"),
      () => E.right(bettingGame)
    )
  );
}

function addBettingRoundWithPreviousRoundBettingOptions(
  bettingGame: GroupBettingGame
): GroupBettingGame {
  const currentRound = bettingGame.currentRound;
  return {
    ...bettingGame,
    currentRound: {
      playerBets: [],
      bettingOptions: currentRound.bettingOptions,
    },
    roundHistory: [...bettingGame.roundHistory, currentRound],
  };
}
