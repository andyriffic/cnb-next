import { GetServerSideProps } from "next";
import Head from "next/head";
import styled from "styled-components";
import { useState } from "react";
import { PrimaryButton, SubHeading } from "../../../../components/Atoms";
import { SpectatorPageLayout } from "../../../../components/SpectatorPageLayout";
import { AdminPlayerView } from "../../../../components/admin/AdminPlayerView";
import { Player } from "../../../../types/Player";
import { getAllPlayers } from "../../../../utils/data/aws-dynamodb-players";
import { sortByPlayerName } from "../../../../utils/sort";
import { AdminPlayerEdit } from "../../../../components/admin/AdminPlayerEdit";
import { CenterSpaced } from "../../../../components/Layouts";
import { AdminPlayerAdd } from "../../../../components/admin/AdminPlayerAdd";
import {
  fetchGetPlayer,
  resetAllPlayerPacmanDetails,
  resetAllPlayerSpaceRaceDetails,
  resetAllPlayerTotalCoins,
  resetAllPlayerZombieDetails,
} from "../../../../utils/api";

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
  retiredPlayers: Player[];
};

export default function Page({ retiredPlayers }: Props) {
  const [editingPlayer, setEditingPlayer] = useState<Player | undefined>();
  const [workingRetiredPlayers, setWorkingRetiredPlayers] =
    useState(retiredPlayers);

  return (
    <>
      <Head>
        <title>Finx Rocks - Player Admin</title>
      </Head>
      <SpectatorPageLayout>
        <SubHeading style={{ textAlign: "center", marginTop: "2rem" }}>
          Retired players
        </SubHeading>
        <PlayerContainer>
          {workingRetiredPlayers.map((player) => (
            <PlayerItem key={player.id}>
              <AdminPlayerView
                player={player}
                onStartEdit={() => setEditingPlayer(player)}
              />
            </PlayerItem>
          ))}
        </PlayerContainer>
        {editingPlayer && (
          <EditModalContainer>
            <AdminPlayerEdit
              player={editingPlayer}
              onClose={(updated) => {
                setEditingPlayer(undefined);
                if (!updated) {
                  return;
                }
              }}
            />
          </EditModalContainer>
        )}
      </SpectatorPageLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const allPlayers = await getAllPlayers();

  const retiredPlayers = allPlayers
    ? allPlayers.filter((p) => p.details?.retired)
    : [];

  return {
    props: {
      retiredPlayers: retiredPlayers.sort(sortByPlayerName),
    },
  };
};
