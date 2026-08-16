import { savePlayersGameMoves as saveSpaceRacePlayersGameMoves } from "./saveGameMovesSpaceRace";
import { savePlayersGameMoves as saveZombieRunPlayersGameMoves } from "./saveGameMovesZombieRun";

//Update this to the current mini-game so users get the correct points allocation and game behaviour

const getSaveGameForTeam = (team: string | undefined) => {
  if (!team) {
    return saveSpaceRacePlayersGameMoves;
  }

  switch (team.toLowerCase()) {
    case "corgi": {
      return saveZombieRunPlayersGameMoves;
    }
    default: {
      return saveSpaceRacePlayersGameMoves;
    }
  }
};

export default getSaveGameForTeam;
