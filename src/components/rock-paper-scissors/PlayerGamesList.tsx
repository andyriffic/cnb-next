import Link from "next/link";
import { useMemo } from "react";
import styled from "styled-components";
import { useSocketIo } from "../../providers/SocketIoProvider";
import { Card, SubHeading } from "../Atoms";
import { getAiOverlordPlayerUrl, getGasOutPlayerUrl } from "../../utils/url";

const TappableLink = styled.a`
  display: block;
  padding: 1rem 0;
  margin: 1rem 0;
`;

type Props = {
  playerId: string;
};

export const PlayerGamesList = ({ playerId }: Props): JSX.Element | null => {
  const {
    rockPaperScissors: { activeRPSGames },
    groupBetting: { bettingGames },
    aiOverlord: { aiOverlordGames },
    gasGame: { gasGames },
  } = useSocketIo();

  const playersGames = useMemo(() => {
    return [
      ...activeRPSGames.filter((game) =>
        game.players.find((p) => p.id === playerId)
      ),
      ...bettingGames.filter((game) =>
        game.playerWallets.map((pw) => pw.player.id).includes(playerId)
      ),
    ];
  }, [activeRPSGames, bettingGames, playerId]);

  const overlordGames = useMemo(() => {
    return aiOverlordGames.filter((game) =>
      game.opponents.map((o) => o.playerId).includes(playerId)
    );
  }, [aiOverlordGames, playerId]);

  const playerGasGames = useMemo(() => {
    return gasGames.filter((game) =>
      game.allPlayers.map((p) => p.player.id).includes(playerId)
    );
  }, [gasGames, playerId]);

  return playersGames ? (
    <div>
      <Card>
        <SubHeading>Games in progress</SubHeading>
        <ul>
          {playersGames.map((game) => (
            <li key={game.id}>
              <Link
                href={`/play/${playerId}/rock-paper-scissors?gameId=${game.id}`}
                passHref={true}
                legacyBehavior
              >
                <TappableLink>RPS: {game.id}</TappableLink>
              </Link>
            </li>
          ))}
        </ul>
        <ul>
          {overlordGames.map((game) => (
            <li key={game.gameId}>
              <Link
                href={getAiOverlordPlayerUrl(playerId, game.gameId)}
                passHref={true}
                legacyBehavior
              >
                <TappableLink>AI Overlord: {game.gameId}</TappableLink>
              </Link>
            </li>
          ))}
        </ul>
        <ul>
          {playerGasGames.map((game) => (
            <li key={game.id}>
              <Link
                href={getGasOutPlayerUrl(playerId, game.id)}
                passHref={true}
                legacyBehavior
              >
                <TappableLink>Balloon: {game.id}</TappableLink>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  ) : null;
};
