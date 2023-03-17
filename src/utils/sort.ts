import { Player } from "../types/Player";

export const sortByPlayerName = (a: Player, b: Player) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};
