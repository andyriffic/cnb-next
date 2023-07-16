import { useEffect } from "react";
import { useBettingGame } from "../../../providers/SocketIoProvider/useGroupBetting";
import { useRPSGame } from "../../../providers/SocketIoProvider/useRockPaperScissorsSocket";

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

    if (rpsGame.roundHistory.length < bettingGame.roundHistory.length) {
      //If rpsGame has less rounds then that's a problem but just gonna ignore that (It shouldn't happen right 😅)
      console.log(
        "useSyncRockPapersScissorsWithBettingGame",
        "No need to sync"
      );
      return;
    }

    if (rpsGame.roundHistory.length === bettingGame.roundHistory.length) {
      const rpsGameResult = rpsGame.currentRound.result;
      const betResult = bettingGame.currentRound.result;
      if (rpsGameResult && !betResult) {
        console.log(
          "useSyncRockPapersScissorsWithBettingGame",
          "Setting bet result for last game"
        );

        const winningOptionId = rpsGameResult.winningPlayerId
          ? rpsGameResult.winningPlayerId
          : "draw";

        resolveBettingRound(winningOptionId);
      }
    } else if (rpsGame.roundHistory.length > bettingGame.roundHistory.length) {
      console.log(
        "useSyncRockPapersScissorsWithBettingGame",
        "Adding new betting round"
      );
      newBettingRound();
    }

    // const lastRpsRoundResult =
    //   rpsGame.rounds[rpsGame.rounds.length - 2]!.result!;

    // const lastBettingRound = bettingGame.rounds[bettingGame.rounds.length - 1]!;

    // if (!lastBettingRound.result) {
    //   console.log(
    //     "useSyncRockPapersScissorsWithBettingGame",
    //     "Setting bet result for last game"
    //   );

    //   const winningOptionId = lastRpsRoundResult.winningPlayerId
    //     ? lastRpsRoundResult.winningPlayerId
    //     : "draw";

    //   resolveBettingRound(winningOptionId);
    // } else {
    //   newBettingRound();
    // }
  }, [rpsGame, bettingGame, resolveBettingRound, newBettingRound]);
}
