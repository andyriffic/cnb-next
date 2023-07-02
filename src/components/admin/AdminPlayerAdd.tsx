import styled from "styled-components";
import { useState } from "react";
import { Player, PlayerDetails } from "../../types/Player";
import { Card } from "../Atoms";
import { EvenlySpaced } from "../Layouts";
import { PlayerAvatar } from "../PlayerAvatar";
import { addPlayerFetch, updatePlayerDetails } from "../../utils/api";
import { CreatePlayerParams } from "../../pages/api/player";

const PlayerDetailsContainer = styled.div`
  flex: 1;
`;

type Props = {
  onClose: (updated: boolean) => void;
};

export const AdminPlayerAdd = ({ onClose }: Props) => {
  const [playerParams, setPlayerParams] = useState<CreatePlayerParams>({
    id: "",
    name: "",
  });

  return (
    <Card
      style={{
        margin: 0,
        padding: "1rem",
        border: "0.3rem solid black",
      }}
    >
      <EvenlySpaced style={{ gap: "0.5rem" }}>
        <form>
          <fieldset>
            <label htmlFor="player_id">Id</label>
            <input
              id="player_id"
              type="text"
              maxLength={20}
              value={playerParams.id}
              onChange={(e) =>
                setPlayerParams({
                  ...playerParams,
                  id: e.target.value,
                })
              }
            />
          </fieldset>
          <fieldset>
            <label htmlFor="player_name">Name</label>
            <input
              id="player_name"
              type="text"
              maxLength={40}
              value={playerParams.name}
              onChange={(e) =>
                setPlayerParams({
                  ...playerParams,
                  name: e.target.value,
                })
              }
            />
          </fieldset>
        </form>
      </EvenlySpaced>
      <EvenlySpaced>
        <button onClick={() => onClose(false)}>Cancel</button>
        <button
          onClick={() => {
            addPlayerFetch(playerParams).then(() => onClose(true));
          }}
        >
          Save
        </button>
      </EvenlySpaced>
    </Card>
  );
};

function deepClone<T>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}
