import { GameTypes } from "../../pages/join/[groupId]";
import { getDayName } from "../date";
import { selectRandomOneOf } from "../random";

export function getSuggestedGame(date: Date): GameTypes | "ask-audience" {
  const dayName = getDayName(date);

  switch (dayName) {
    case "Monday": {
      return "number-crunch";
    }
    case "Tuesday": {
      return "rps";
    }
    // case "Wednesday":
    case "Thursday": {
      return "balloon";
    }
    case "Friday": {
      return "ask-audience";
    }
    default: {
      return selectRandomOneOf(["balloon", "rps", "number-crunch"]);
    }
  }
}
