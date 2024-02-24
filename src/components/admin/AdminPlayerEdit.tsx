import { useState } from "react";
import styled from "styled-components";
import {
  Player,
  PlayerDetails,
  getPlayerAchievements,
  getPlayerPacManDetails,
  getPlayerZombieRunDetails,
} from "../../types/Player";
import {
  deletePlayerZombieDetails,
  updatePlayerDetails,
} from "../../utils/api";
import { Card } from "../Atoms";
import { EvenlySpaced } from "../Layouts";
import { PlayerAvatar } from "../PlayerAvatar";
import { AdminPlayerEditBooleanValue } from "./AdminPlayerEditBooleanValue";
import { AdminPlayerEditNumberValue } from "./AdminPlayerEditNumberValue";
import { AdminPlayerEditStringValue } from "./AdminPlayerEditStringValue";

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
          <p>{playerCopy.id}</p>
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
          <AdminPlayerEditBooleanValue
            label="Retired"
            id="retired"
            value={!!playerCopy.details?.retired}
            onChange={(checked) =>
              setPlayerCopy({
                ...playerCopy,
                details: {
                  ...playerCopy.details,
                  retired: checked,
                },
              })
            }
          />
          <AdminPlayerEditStringValue
            label="Role"
            id="role"
            value={playerCopy.details?.role || ""}
            onChange={(value) => {
              setPlayerCopy({
                ...playerCopy,
                details: {
                  ...playerCopy.details,
                  role: value,
                },
              });
            }}
          />
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
          <hr />
          <h6 style={{ fontWeight: "bold" }}>Pacman</h6>
          <AdminPlayerEditBooleanValue
            label="Pacman"
            id="pacman_player"
            value={!!playerCopy.details?.pacmanPlayer}
            onChange={(checked) =>
              setPlayerCopy({
                ...playerCopy,
                details: {
                  ...playerCopy.details,
                  pacmanPlayer: checked,
                },
              })
            }
          />
          <fieldset>
            <label htmlFor="pacman_index">Index</label>
            <input
              id="pacman_index"
              type="number"
              min={0}
              step={1}
              value={playerCopy.details?.pacmanDetails?.index || 0}
              onChange={(e) =>
                setPlayerCopy({
                  ...playerCopy,
                  details: {
                    ...playerCopy.details,
                    pacmanDetails: {
                      ...getPlayerPacManDetails(playerCopy),
                      index: e.target.valueAsNumber,
                    },
                  },
                })
              }
            />
          </fieldset>
          <fieldset>
            <label htmlFor="pacman_jail">Jail turns</label>
            <input
              id="pacman_index"
              type="number"
              min={0}
              max={3}
              step={1}
              value={playerCopy.details?.pacmanDetails?.jailTurnsRemaining || 0}
              onChange={(e) =>
                setPlayerCopy({
                  ...playerCopy,
                  details: {
                    ...playerCopy.details,
                    pacmanDetails: {
                      ...getPlayerPacManDetails(playerCopy),
                      jailTurnsRemaining: e.target.valueAsNumber,
                    },
                  },
                })
              }
            />
          </fieldset>

          <AdminPlayerEditBooleanValue
            label="Power Pill"
            id="pacman_powerpill"
            value={!!playerCopy.details?.pacmanDetails?.hasPowerPill}
            onChange={(checked) =>
              setPlayerCopy({
                ...playerCopy,
                details: {
                  ...playerCopy.details,
                  pacmanDetails: {
                    ...getPlayerPacManDetails(playerCopy),
                    hasPowerPill: checked,
                  },
                },
              })
            }
          />
          <hr />
          <EvenlySpaced style={{ marginBottom: "1rem" }}>
            <h6 style={{ fontWeight: "bold" }}>Zombie Run</h6>
            <button
              type="button"
              style={{ backgroundColor: "red" }}
              onClick={() => {
                deletePlayerZombieDetails(playerCopy.id).then(() => {
                  onClose(true);
                });
              }}
            >
              Delete Zombie details
            </button>
          </EvenlySpaced>
          <AdminPlayerEditNumberValue
            label="Total Metres"
            id="zombie_metres"
            value={playerCopy.details?.zombieRun?.totalMetresRun || 0}
            onChange={(value) =>
              setPlayerCopy({
                ...playerCopy,
                details: {
                  ...playerCopy.details,
                  zombieRun: {
                    ...getPlayerZombieRunDetails(playerCopy),
                    totalMetresRun: value,
                  },
                },
              })
            }
          />
          <AdminPlayerEditNumberValue
            label="Finish Position"
            id="zombie_finish_position"
            value={playerCopy.details?.zombieRun?.finishPosition || 0}
            onChange={(value) =>
              setPlayerCopy({
                ...playerCopy,
                details: {
                  ...playerCopy.details,
                  zombieRun: {
                    ...getPlayerZombieRunDetails(playerCopy),
                    totalMetresRun: value,
                  },
                },
              })
            }
          />
          <AdminPlayerEditBooleanValue
            label="isZombie"
            id="zombie_isZombie"
            value={!!playerCopy.details?.zombieRun?.isZombie}
            onChange={(checked) =>
              setPlayerCopy({
                ...playerCopy,
                details: {
                  ...playerCopy.details,
                  zombieRun: {
                    ...getPlayerZombieRunDetails(playerCopy),
                    isZombie: checked,
                  },
                },
              })
            }
          />
          <hr />
          <fieldset>
            <legend>Achievements</legend>
            <AdminPlayerEditNumberValue
              label="Total Pacman Wins"
              id="achievements_pacman_totalwins"
              value={playerCopy.details?.achievements?.pacman?.totalWins || 0}
              onChange={(value) => {
                const achievements = getPlayerAchievements(playerCopy);
                setPlayerCopy({
                  ...playerCopy,
                  details: {
                    ...playerCopy.details,
                    achievements: {
                      ...achievements,
                      pacman: {
                        ...achievements.pacman,
                        totalWins: value,
                      },
                    },
                  },
                });
              }}
            />
          </fieldset>
        </form>
      </div>
      <EvenlySpaced>
        <button onClick={() => onClose(false)}>Cancel</button>
        <button
          onClick={() => {
            console.log("Saving", playerCopy);
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
