import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";

import {
  BettingOption,
  GroupBettingGame,
  GroupBettingRoundResult,
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
    rounds: [{ index: 0, bettingOptions, playerBets: [] }],
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
    E.chain((betGame) => addPlayerBetToCurrentRound(playerBet, betGame))
  );
}

export function applyBetResultToCurrentRound(
  bettingGame: GroupBettingGame,
  winningOptionId: string
): E.Either<string, GroupBettingGame> {
  return pipe(
    getCurrentBettingRound(bettingGame),
    E.fromOption(() => "No current betting round"),
    E.chain((bettingRound) =>
      applyResultToBettingRound(bettingRound, winningOptionId)
    ),
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
          totalWinnings: won ? bet.betValue * winingOption.odds : -bet.betValue,
        };
      }),
    },
  } as GroupPlayerBettingRound);
}

function checkCurrentRoundHasBetResult(
  bettingGame: GroupBettingGame
): E.Either<string, GroupBettingGame> {
  return pipe(
    getCurrentBettingRound(bettingGame),
    O.chain((round) => O.fromNullable(round.result)),
    O.match(
      () => E.left("Current round does not have result"),
      () => E.right(bettingGame)
    )
  );
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
    O.map((result) => result.bettingGame),
    E.fromOption(() => "")
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
      rounds: bettingGame.rounds.map((r) =>
        r.index === round.index ? round : r
      ),
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

function addBettingRoundWithPreviousRoundBettingOptions(
  bettingGame: GroupBettingGame
): GroupBettingGame {
  //Just gonna assume there's a previous round 😅
  const lastBettingOptions =
    bettingGame.rounds[bettingGame.rounds.length - 1]!.bettingOptions;
  return {
    ...bettingGame,
    rounds: [
      ...bettingGame.rounds,
      {
        index: bettingGame.rounds.length,
        playerBets: [],
        bettingOptions: lastBettingOptions,
      },
    ],
  };
}

function getCurrentBettingRound(
  bettingGame: GroupBettingGame
): O.Option<GroupPlayerBettingRound> {
  return pipe(bettingGame.rounds, A.last);
}
