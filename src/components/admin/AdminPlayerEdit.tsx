import styled from "styled-components";
import { Player } from "../../types/Player";
import { Card } from "../Atoms";
import { EvenlySpaced } from "../Layouts";
import { PlayerAvatar } from "../PlayerAvatar";

const PlayerDetailsContainer = styled.div`
  flex: 1;
`;

type Props = {
  player: Player;
};

export const AdminPlayerEdit = ({ player }: Props) => {
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
          <p style={{ textAlign: "center", fontWeight: "bold" }}>
            {player.name}
          </p>
        </div>
        <PlayerDetailsContainer>
          <ul>
            {player.tags.map((tag, i) => (
              <li key={i}>{tag}</li>
            ))}
          </ul>
        </PlayerDetailsContainer>
      </EvenlySpaced>
    </Card>
  );
};
