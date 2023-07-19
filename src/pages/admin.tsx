import { GetServerSideProps } from "next";
import Head from "next/head";
import styled from "styled-components";
import { useState } from "react";
import { PrimaryButton, SubHeading } from "../components/Atoms";
import { SpectatorPageLayout } from "../components/SpectatorPageLayout";
import { AdminPlayerView } from "../components/admin/AdminPlayerView";
import { Player } from "../types/Player";
import { getAllPlayers } from "../utils/data/aws-dynamodb";
import { sortByPlayerName } from "../utils/sort";
import { AdminPlayerEdit } from "../components/admin/AdminPlayerEdit";
import { CenterSpaced } from "../components/Layouts";
import { AdminPlayerAdd } from "../components/admin/AdminPlayerAdd";

const PlayerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  justify-content: center;
  padding: 2rem;
`;

const PlayerItem = styled.div`
  flex-basis: 48%;
`;

const PlayerDetailsContainer = styled.div`
  flex: 1;
`;

const EditModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  activePlayers: Player[];
  retiredPlayers: Player[];
};

export default function Page({ activePlayers, retiredPlayers }: Props) {
  const [editingPlayer, setEditingPlayer] = useState<Player | undefined>();
  const [addingPlayer, setAddingPlayer] = useState(false);

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
            <PlayerItem
              key={player.id}
              style={{ cursor: "pointer" }}
              onClick={() => setEditingPlayer(player)}
            >
              <AdminPlayerView player={player} />
            </PlayerItem>
          ))}
        </PlayerContainer>
        <SubHeading style={{ textAlign: "center" }}>Retired</SubHeading>
        <PlayerContainer>
          {retiredPlayers.map((player) => (
            <PlayerItem
              key={player.id}
              style={{ cursor: "pointer" }}
              onClick={() => setEditingPlayer(player)}
            >
              <AdminPlayerView player={player} />
            </PlayerItem>
          ))}
        </PlayerContainer>
        {editingPlayer && (
          <EditModalContainer>
            <AdminPlayerEdit
              player={editingPlayer}
              onClose={(updated) => {
                setEditingPlayer(undefined);
                // updated && window.location.reload();
              }}
            />
          </EditModalContainer>
        )}
        {addingPlayer && (
          <EditModalContainer>
            <AdminPlayerAdd
              onClose={() => {
                setAddingPlayer(false);
                // updated && window.location.reload();
              }}
            />
          </EditModalContainer>
        )}
        <CenterSpaced>
          <PrimaryButton onClick={() => setAddingPlayer(true)}>
            Add Player
          </PrimaryButton>
        </CenterSpaced>
      </SpectatorPageLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const allPlayers = await getAllPlayers();

  const activePlayers = allPlayers
    ? allPlayers.filter((p) => !p.details?.retired)
    : [];
  const retiredPlayers = allPlayers
    ? allPlayers.filter((p) => !!p.details?.retired)
    : [];

  return {
    props: {
      activePlayers: activePlayers.sort(sortByPlayerName),
      retiredPlayers: retiredPlayers.sort(sortByPlayerName),
    },
  };
};
