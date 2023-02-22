import Link from "next/link";
import { useMemo } from "react";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { Card, SubHeading } from "../Atoms";

type Props = {
  playerId: string;
};
export const PlayerGamesList = ({ playerId }: Props): JSX.Element | null => {
  const {
    rockPaperScissors: { activeRPSGames },
    groupBetting: { bettingGames },
  } = useSocketIo();

  const playersGames = useMemo(() => {
    return [
      ...activeRPSGames.filter((game) => game.playerIds.includes(playerId)),
      ...bettingGames.filter((game) =>
        game.playerWallets.map((pw) => pw.playerId).includes(playerId)
      ),
    ];
  }, [activeRPSGames, playerId]);

  return playersGames ? (
    <div>
      <Card>
        <SubHeading>Games in progress</SubHeading>
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
      </Card>
    </div>
  ) : null;
};
