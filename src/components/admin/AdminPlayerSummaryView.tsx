import styled from "styled-components";
import { Player } from "../../types/Player";
import { Card, SmallPill } from "../Atoms";
import { CenterSpaced, EvenlySpaced } from "../Layouts";
import { PlayerAvatar } from "../PlayerAvatar";
import { COLORS } from "../../colors";
import { getTeamDetails } from "../../teams";
import { AdminPlayerDetail } from "./AdminPlayerDetail";

const PlayerDetailsContainer = styled.div`
  flex: 1;
`;

type Props = {
  player: Player;
  onStartEdit: () => void;
};

export const AdminPlayerSummaryView = ({ player, onStartEdit }: Props) => {
  const teamDetails = getTeamDetails(player.details?.team || "none");
  return (
    <Card>
      <CenterSpaced stacked style={{ gap: "0.4rem" }}>
        <PlayerAvatar playerId={player.id} size="thumbnail" />
        <SmallPill fullWidth>{player.name}</SmallPill>
        <SmallPill
          fullWidth
          style={{
            backgroundColor: teamDetails.backgroundColor,
            color: teamDetails.textColor,
          }}
        >
          {teamDetails.name}
        </SmallPill>
        <button onClick={onStartEdit}>Edit</button>
      </CenterSpaced>
    </Card>
  );
};
