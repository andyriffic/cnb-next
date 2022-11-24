import { useEffect } from "react";
import { useBettingGame } from "../../providers/SocketIoProvider/useGroupBetting";
import { useRPSGame } from "../../providers/SocketIoProvider/useRockPaperScissorsSocket";

export function useSyncRockPapersScissorsWithBettingGame(gameId: string) {
  const { game: rpsGame } = useRPSGame(gameId);
  const { bettingGame, resolveBettingRound, newBettingRound } =
    useBettingGame(gameId);
  //   const lastSyncedRoundIndex = useRef<number | undefined>();

  useEffect(() => {
    if (!(rpsGame && bettingGame)) {
      return;
    }

    // const totalRpsResolvedRounds

    if (rpsGame.rounds.length <= bettingGame.rounds.length) {
      //If rpsGame has less rounds then that's a problem but just gonna ignore that (It shouldn't happen right 😅)
      console.log(
        "useSyncRockPapersScissorsWithBettingGame",
        "No need to sync"
      );
      return;
    }

    const lastRpsRoundResult =
      rpsGame.rounds[rpsGame.rounds.length - 2]!.result!;

    const lastBettingRound = bettingGame.rounds[bettingGame.rounds.length - 1]!;

    if (!lastBettingRound.result) {
      console.log(
        "useSyncRockPapersScissorsWithBettingGame",
        "Setting bet result for last game"
      );

      const winningOptionId = lastRpsRoundResult.winningPlayerId
        ? lastRpsRoundResult.winningPlayerId
        : "draw";

      resolveBettingRound(winningOptionId);
    } else {
      console.log(
        "useSyncRockPapersScissorsWithBettingGame",
        "Adding new betting round"
      );

      newBettingRound();
    }
  }, [rpsGame, bettingGame, resolveBettingRound, newBettingRound]);
}
