import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";

import {
  BettingOption,
  GroupPlayerBettingRound,
  PlayerBet,
  PlayerBettingRoundResult,
} from "./types";

export function createBettingEvent(
  id: string,
  bettingOptions: BettingOption[]
): E.Either<string, GroupPlayerBettingRound> {
  return E.right({
    id,
    bettingOptions: [...bettingOptions],
    playerBets: [],
  });
}

export function addPlayerBet(
  bettingRound: GroupPlayerBettingRound,
  playerBet: PlayerBet
): E.Either<string, GroupPlayerBettingRound> {
  return pipe(
    bettingRound.playerBets,
    A.findFirst((existingBet) => existingBet.playerId === playerBet.playerId),
    O.match(
      () => E.right(addPlayerBetToRound(bettingRound, playerBet)),
      () => E.left(`Player "${playerBet.playerId}" has already placed a bet`)
    )
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

function addPlayerBetToRound(
  bettingRound: GroupPlayerBettingRound,
  playerBet: PlayerBet
): GroupPlayerBettingRound {
  return {
    ...bettingRound,
    playerBets: [...bettingRound.playerBets, playerBet],
  };
}
