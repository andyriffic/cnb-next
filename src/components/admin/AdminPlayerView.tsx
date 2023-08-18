import styled from "styled-components";
import { Player } from "../../types/Player";
import { Card } from "../Atoms";
import { EvenlySpaced } from "../Layouts";
import { PlayerAvatar } from "../PlayerAvatar";
import { COLORS } from "../../colors";
import { AdminPlayerDetail } from "./AdminPlayerDetail";

const PlayerDetailsContainer = styled.div`
  flex: 1;
`;

type Props = {
  player: Player;
};

export const AdminPlayerView = ({ player }: Props) => {
  return (
    <Card
      style={{
        margin: 0,
        padding: "0.3rem",
      }}
    >
      <EvenlySpaced style={{ gap: "0.5rem" }}>
        <div>
          <PlayerAvatar playerId={player.id} size="thumbnail" />
          <p
            style={{
              textAlign: "center",
              padding: "0.2rem",
              // fontWeight: "bold",
              color: "white",
              backgroundColor: COLORS.borderPrimary,
            }}
          >
            {player.name}
          </p>
          <p>{player.id}</p>
          {/* <p style={{ textAlign: "center", fontWeight: "bold" }}>
            <NumericValue>
              {player.details?.gameMoves || 0}
            </NumericValue>
          </p> */}
        </div>
        <PlayerDetailsContainer>
          <ul>
            {player.tags.map((tag, i) => (
              <li key={i}>{tag}</li>
            ))}
          </ul>
          <hr />
          <AdminPlayerDetail obj={player.details} />
        </PlayerDetailsContainer>
      </EvenlySpaced>
    </Card>
  );
};
