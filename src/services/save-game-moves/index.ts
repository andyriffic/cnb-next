import { savePlayersGameMoves as saveSnakesAndLaddeersPlayersGameMoves } from "./saveGameMovesSnakesAndLadders";
import { savePlayersGameMoves as savePacmansPlayersGameMoves } from "./saveGameMovesPacman";

//Update this to the current mini-game so users get the correct points allocation and game behaviour

const getSaveGameForTeam = (team: string | undefined) => {
  if (!team) {
    return saveSnakesAndLaddeersPlayersGameMoves;
  }

  switch (team.toLowerCase()) {
    case "corgi": {
      return savePacmansPlayersGameMoves;
    }
    default: {
      return saveSnakesAndLaddeersPlayersGameMoves;
    }
  }
};

export default getSaveGameForTeam;
