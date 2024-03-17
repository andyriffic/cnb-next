import { GameTypes } from "../../pages/join/[groupId]";
import { selectRandomOneOf } from "../random";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const getDayName = (date: Date): string => {
  return DAYS_OF_WEEK[date.getDay()] || "";
};

export function getSuggestedGame(date: Date): GameTypes {
  const dayName = getDayName(date);

  switch (dayName) {
    case "Monday": {
      return "number-crunch";
    }
    case "Tuesday": {
      return "rps";
    }
    case "Thursday": {
      return "balloon";
    }
    default: {
      return selectRandomOneOf(["balloon", "rps", "number-crunch"]);
    }
  }
}
