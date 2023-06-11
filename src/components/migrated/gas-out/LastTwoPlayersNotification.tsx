import { useMemo, useRef } from "react";
import { GasGame } from "../../../services/migrated/gas-out/types";
import { SplashContent } from "../../SplashContent";

type Props = {
  game: GasGame;
};

export function LastTwoPlayersNotification({
  game,
}: Props): JSX.Element | null {
  const displayed = useRef(false);

  const lastTwoPlayerNames = useMemo<[string, string] | undefined>(() => {
    if (displayed.current || !!game.currentPlayer.cardPlayed) {
      return;
    }

    const activePlayers = game.allPlayers.filter((p) => p.status === "alive");

    if (activePlayers.length !== 2) {
      return;
    }
    displayed.current = true;
    return [activePlayers[0]!.player.name, activePlayers[1]!.player.name];
  }, [game]);

  return lastTwoPlayerNames ? (
    <SplashContent>
      {lastTwoPlayerNames[0]} vs {lastTwoPlayerNames[1]}
    </SplashContent>
  ) : null;
}
