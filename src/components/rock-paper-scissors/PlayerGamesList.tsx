import Link from "next/link";
import { useMemo } from "react";
import { useSocketIo } from "../../providers/SocketIoProvider";

type Props = {
  playerId: string;
};
export const PlayerGamesList = ({ playerId }: Props): JSX.Element | null => {
  const { activeRPSGames } = useSocketIo();

  const playersGames = useMemo(() => {
    return activeRPSGames.filter((game) => game.playerIds.includes(playerId));
  }, [activeRPSGames, playerId]);

  return playersGames ? (
    <div>
      <h2>Games</h2>
      <div>
        {playersGames.map((game) => (
          <Link
            key={game.id}
            href={`/play/${playerId}/rock-paper-scissors/${game.id}`}
          >
            {game.id}
          </Link>
        ))}
      </div>
    </div>
  ) : null;
};
