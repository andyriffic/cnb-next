import { GetServerSideProps } from "next";
import Head from "next/head";
import styled from "styled-components";
import { AdminPlayerView } from "../components/admin/AdminPlayerView";
import { Card, SubHeading } from "../components/Atoms";
import { EvenlySpaced } from "../components/Layouts";
import { NumericValue } from "../components/NumericValue";
import { PlayerAvatar } from "../components/PlayerAvatar";
import { SpectatorPageLayout } from "../components/SpectatorPageLayout";
import { Player } from "../types/Player";
import { getAllPlayers } from "../utils/data/aws-dynamodb";
import { sortByPlayerName } from "../utils/sort";

const PlayerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  justify-content: center;
  padding: 2rem;
`;

const PlayerItem = styled.div`
  /* width: 30%; */
`;

const PlayerDetailsContainer = styled.div`
  flex: 1;
`;

type Props = {
  activePlayers: Player[];
  retiredPlayers: Player[];
};

export default function Page({ activePlayers, retiredPlayers }: Props) {
  return (
    <>
      <Head>
        <title>Finx Rocks - Player Admin</title>
      </Head>
      <SpectatorPageLayout>
        <SubHeading style={{ textAlign: "center", marginTop: "2rem" }}>
          Active
        </SubHeading>
        <PlayerContainer>
          {activePlayers.map((player) => (
            <PlayerItem key={player.id}>
              <AdminPlayerView player={player} />
            </PlayerItem>
          ))}
        </PlayerContainer>
        <SubHeading style={{ textAlign: "center" }}>Retired</SubHeading>
        <PlayerContainer>
          {retiredPlayers.map((player) => (
            <PlayerItem key={player.id}>
              <AdminPlayerView player={player} />
            </PlayerItem>
          ))}
        </PlayerContainer>
      </SpectatorPageLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const allPlayers = await getAllPlayers();

  const activePlayers = allPlayers
    ? allPlayers.filter((p) => !p.tags.includes("retired"))
    : [];
  const retiredPlayers = allPlayers
    ? allPlayers.filter((p) => p.tags.includes("retired"))
    : [];

  return {
    props: {
      activePlayers: activePlayers.sort(sortByPlayerName),
      retiredPlayers: retiredPlayers.sort(sortByPlayerName),
    },
  };
};
