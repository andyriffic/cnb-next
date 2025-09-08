export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export enum DAY_OF_WEEK {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export const getDayOfWeek = (date: Date = new Date()): DAY_OF_WEEK => {
  return date.getDay();
};

export const getDayName = (date: Date = new Date()): string => {
  return DAYS_OF_WEEK[date.getDay()] || "";
};

export const getDayOfMonth = (date: Date = new Date()): number => {
  return date.getDate();
};
