import { savePlayersGameMoves as savePacmaPlayersGameMoves } from "./saveGameMovesPacman";
import { savePlayersGameMoves as saveSpaceRacePlayersGameMoves } from "./saveGameMovesSpaceRace";

//Update this to the current mini-game so users get the correct points allocation and game behaviour

const getSaveGameForTeam = (team: string | undefined) => {
  if (!team) {
    return savePacmaPlayersGameMoves;
  }

  switch (team.toLowerCase()) {
    case "corgi": {
      return saveSpaceRacePlayersGameMoves;
    }
    default: {
      return savePacmaPlayersGameMoves;
    }
  }
};

export default getSaveGameForTeam;
