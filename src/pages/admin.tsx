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
import {
  fetchGetPlayer,
  resetAllPlayerPacmanDetails,
  resetAllPlayerSpaceRaceDetails,
  resetAllPlayerTotalCoins,
  resetAllPlayerZombieDetails,
} from "../utils/api";

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
  const [playersUpdating, setPlayersUpdating] = useState<string[]>([]);
  const [workingActivePlayers, setWorkingActivePlayers] =
    useState(activePlayers);

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
          {workingActivePlayers.map((player) => (
            <PlayerItem key={player.id}>
              <AdminPlayerView
                player={player}
                onStartEdit={() => setEditingPlayer(player)}
              />
            </PlayerItem>
          ))}
        </PlayerContainer>
        <SubHeading style={{ textAlign: "center" }}>Retired</SubHeading>
        <PlayerContainer>
          {retiredPlayers.map((player) => (
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

                setPlayersUpdating([...playersUpdating, editingPlayer.id]);
                fetchGetPlayer(editingPlayer.id).then((updatedPlayer) => {
                  updatedPlayer &&
                    setWorkingActivePlayers(
                      workingActivePlayers.map((p) =>
                        p.id === editingPlayer.id ? updatedPlayer : p
                      )
                    );
                });
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
          <button
            type="button"
            style={{ backgroundColor: "red" }}
            onClick={() => {
              resetAllPlayerZombieDetails().then(() => {
                alert(
                  "All player zombie details reset. Remember to check Setting Player settings!"
                );
              });
            }}
          >
            Reset ALL Zombie Run details
          </button>
          <button
            type="button"
            style={{ backgroundColor: "goldenrod" }}
            onClick={() => {
              resetAllPlayerPacmanDetails().then(() => {
                alert(
                  "All player pacman details reset. Remember to check Setting Player settings!"
                );
              });
            }}
          >
            Reset ALL Pacman details
          </button>
          <button
            type="button"
            style={{ backgroundColor: "darkred", color: "white" }}
            onClick={() => {
              resetAllPlayerSpaceRaceDetails().then(() => {
                alert(
                  "All player Space Race details reset. Remember to check Setting Player settings!"
                );
              });
            }}
          >
            Reset ALL Space Race details 🚀
          </button>
          <button
            type="button"
            style={{ backgroundColor: "yellow", color: "black" }}
            onClick={() => {
              resetAllPlayerTotalCoins().then(() => {
                alert("All player Total Coins details reset.");
              });
            }}
          >
            Reset ALL total coins 🪙
          </button>
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
