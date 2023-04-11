import Link from "next/link";
import { useMemo } from "react";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { Card, SubHeading } from "../Atoms";
import { getAiOverlordPlayerUrl } from "../../utils/url";

type Props = {
  playerId: string;
};
export const PlayerGamesList = ({ playerId }: Props): JSX.Element | null => {
  const {
    rockPaperScissors: { activeRPSGames },
    groupBetting: { bettingGames },
    aiOverlord: { aiOverlordGames },
  } = useSocketIo();

  const playersGames = useMemo(() => {
    return [
      ...activeRPSGames.filter((game) => game.playerIds.includes(playerId)),
      ...bettingGames.filter((game) =>
        game.playerWallets.map((pw) => pw.playerId).includes(playerId)
      ),
    ];
  }, [activeRPSGames, bettingGames, playerId]);

  const overlordGames = useMemo(() => {
    return aiOverlordGames.filter((game) =>
      game.opponents.map((o) => o.playerId).includes(playerId)
    );
  }, [aiOverlordGames, playerId]);

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
        <ul>
          {overlordGames.map((game) => (
            <li key={game.gameId}>
              <Link href={getAiOverlordPlayerUrl(playerId, game.gameId)}>
                {game.gameId}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  ) : null;
};
