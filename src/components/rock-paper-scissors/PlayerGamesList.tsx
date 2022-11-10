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
      <ul>
        {playersGames.map((game) => (
          <li key={game.id}>
            <Link
              href={`/play/${playerId}/rock-paper-scissors?gameId=${game.id}`}
            >
              {game.id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};
