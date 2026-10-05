import { savePlayersGameMoves as saveSpaceRacePlayersGameMoves } from "./saveGameMovesSpaceRace";
import { savePlayersGameMoves as saveSnakesAndLaddeersPlayersGameMoves } from "./saveGameMovesSnakesAndLadders";

//Update this to the current mini-game so users get the correct points allocation and game behaviour

const getSaveGameForTeam = (team: string | undefined) => {
  if (!team) {
    return saveSpaceRacePlayersGameMoves;
  }

  switch (team.toLowerCase()) {
    case "corgi": {
      return saveSnakesAndLaddeersPlayersGameMoves;
    }
    default: {
      return saveSpaceRacePlayersGameMoves;
    }
  }
};

export default getSaveGameForTeam;
