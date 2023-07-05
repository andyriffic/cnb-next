import styled from "styled-components";
import { useState } from "react";
import { Player, PlayerDetails } from "../../types/Player";
import { Card } from "../Atoms";
import { EvenlySpaced } from "../Layouts";
import { PlayerAvatar } from "../PlayerAvatar";
import { updatePlayerDetails } from "../../utils/api";

const PlayerDetailsContainer = styled.div`
  flex: 1;
`;

type Props = {
  player: Player;
  onClose: (updated: boolean) => void;
};

const DEFAULT_PLAYER_DETAILS: PlayerDetails = {
  gameMoves: 0,
  whosThatCount: 0,
  team: "",
};

export const AdminPlayerEdit = ({ player, onClose }: Props) => {
  const [playerCopy, setPlayerCopy] = useState(deepClone(player));

  return (
    <Card
      style={{
        margin: 0,
        padding: "1rem",
        border: "0.3rem solid black",
      }}
    >
      <EvenlySpaced style={{ gap: "0.5rem" }}>
        <div>
          <PlayerAvatar playerId={playerCopy.id} size="thumbnail" />
          <p style={{ textAlign: "center", fontWeight: "bold" }}>
            {playerCopy.name}
          </p>
        </div>
        <PlayerDetailsContainer>
          <ul>
            {playerCopy.tags.map((tag, i) => (
              <li key={i}>{tag}</li>
            ))}
          </ul>
        </PlayerDetailsContainer>
      </EvenlySpaced>
      <div>
        <form>
          <fieldset>
            <label htmlFor="game_moves">Game Moves</label>
            <input
              id="game_moves"
              type="number"
              min={0}
              step={1}
              value={playerCopy.details?.gameMoves}
              onChange={(e) =>
                setPlayerCopy({
                  ...playerCopy,
                  details: {
                    ...playerCopy.details,
                    gameMoves: e.target.valueAsNumber,
                  },
                })
              }
            />
          </fieldset>
          <fieldset>
            <label htmlFor="pacman_player">Pacman</label>
            <input
              id="pacman_player"
              type="checkbox"
              checked={playerCopy.details?.pacmanPlayer}
              onChange={(e) =>
                setPlayerCopy({
                  ...playerCopy,
                  details: {
                    ...playerCopy.details,
                    pacmanPlayer: e.target.checked,
                  },
                })
              }
            />
          </fieldset>
          <fieldset>
            <label htmlFor="team_name">Team</label>
            <input
              id="team_name"
              type="text"
              maxLength={30}
              value={playerCopy.details?.team}
              onChange={(e) =>
                setPlayerCopy({
                  ...playerCopy,
                  details: {
                    ...playerCopy.details,
                    team: e.target.value,
                  },
                })
              }
            />
          </fieldset>
        </form>
      </div>
      <EvenlySpaced>
        <button onClick={() => onClose(false)}>Cancel</button>
        <button
          onClick={() => {
            updatePlayerDetails(playerCopy.id, playerCopy.details || {}).then(
              () => onClose(true)
            );
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
