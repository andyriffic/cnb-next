import { GameTypes } from "../../pages/join/[groupId]";
import { getDayName } from "../date";

export function getSuggestedGame(date: Date): GameTypes | undefined {
  const dayName = getDayName(date);

  switch (dayName) {
    case "Monday": {
      return "number-crunch";
    }
    case "Tuesday": {
      return "rps";
    }
    case "Saturday": {
      return "balloon";
    }
    // default: {
    //   return selectRandomOneOf(["balloon", "rps", "number-crunch"]);
    // }
  }
}
