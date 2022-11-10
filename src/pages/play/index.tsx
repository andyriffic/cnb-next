import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import styled from "styled-components";
import { SpectatorPageLayout } from "../../components/SpectatorPageLayout";
import { Player } from "../../types/Player";
import { getCnbPlayers } from "../../utils/data/graphql";

const PlayerList = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 2.5rem;
  padding: 1rem;
`;

const PlayerProfileContainer = styled.div`
  position: relative;
`;

const PlayerName = styled.a`
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
  return (
    <SpectatorPageLayout>
      <PlayerList>
        {players.map((player) => (
          <Link key={player.id} href={`/play/${player.id}`} passHref={true}>
            <PlayerName>{player.name}</PlayerName>
          </Link>
        ))}
      </PlayerList>
    </SpectatorPageLayout>
  );
}

const sortByPlayerName = (a: Player, b: Player) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

const activePlayer = (player: Player): boolean => {
  return !player.tags.includes("retired");
};

export const getStaticProps: GetStaticProps = async () => {
  const players = await getCnbPlayers();

  return {
    props: {
      players: players
        ? players.filter(activePlayer).sort(sortByPlayerName)
        : [],
    },
  };
};

export default Page;
