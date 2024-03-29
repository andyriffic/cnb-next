import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { SpectatorPageLayout } from "../../components/SpectatorPageLayout";
import { PlayerRejoinDialog } from "../../components/player/PlayerRejoinDialog";
import { Player } from "../../types/Player";
import { getAllPlayers } from "../../utils/data/aws-dynamodb";
import { sortByPlayerName } from "../../utils/sort";
import { getPlayerHomeUrl } from "../../utils/url";

const PlayerList = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 2.5rem;
  padding: 1rem;
`;

const PlayerNameLink = styled(Link)`
  display: block;
  background-color: #2f70af;
  padding: 1rem;
  color: #f5f5f5;
  /* border: 0.5rem solid #b9848c; */
  border-radius: 1rem;
  font-size: 3rem;
  text-transform: uppercase;
  left: 0;
`;

type Props = {
  players: Player[];
};

function Page({ players }: Props) {
  const { query } = useRouter();

  return (
    <SpectatorPageLayout scrollable={true}>
      <PlayerList>
        {players.map((player) => (
          <PlayerNameLink
            key={player.id}
            href={getPlayerHomeUrl(player.id, query.autoJoinId as string)}
          >
            {player.name}
          </PlayerNameLink>
        ))}
      </PlayerList>
      <PlayerRejoinDialog autoJoinGroupId={query.autoJoinId as string} />
    </SpectatorPageLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const players = await getAllPlayers();

  return {
    props: {
      players: players
        ? players.filter((p) => !p.details?.retired).sort(sortByPlayerName)
        : [],
    },
  };
};

export default Page;
