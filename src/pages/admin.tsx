import { GetServerSideProps } from "next";
import styled from "styled-components";
import { Card } from "../components/Atoms";
import { NumericValue } from "../components/NumericValue";
import { PlayerAvatar } from "../components/PlayerAvatar";
import { SpectatorPageLayout } from "../components/SpectatorPageLayout";
import { Player } from "../types/Player";
import { getAllPlayers } from "../utils/data/aws-dynamodb";
import { sortByPlayerName } from "../utils/sort";

const PlayerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  padding: 2rem;
`;

const PlayerItem = styled.div`
  width: 10rem;
`;

type Props = {
  players: Player[];
};

export default function Page({ players }: Props) {
  return (
    <SpectatorPageLayout>
      <PlayerContainer>
        {players.map((player) => (
          <PlayerItem key={player.id}>
            <Card
              style={{
                margin: 0,
                opacity: player.tags.includes("retired") ? 0.7 : 1,
              }}
            >
              <PlayerAvatar playerId={player.id} size="thumbnail" />
              <p style={{ textAlign: "center" }}>{player.name}</p>
              <p style={{ textAlign: "center", fontWeight: "bold" }}>
                <NumericValue>{player.details?.gameMoves || 0}</NumericValue>
              </p>
            </Card>
          </PlayerItem>
        ))}
      </PlayerContainer>
    </SpectatorPageLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const allPlayers = await getAllPlayers();

  return {
    props: {
      players: allPlayers ? allPlayers.sort(sortByPlayerName) : [],
    },
  };
};
