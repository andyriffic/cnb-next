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

export const getMonthDisplayName = (monthNumber: number): string => {
  // write a function that converts a month number (1-12) to a month name
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("default", { month: "long" });
};

export const getDayOfWeek = (date: Date = new Date()): DAY_OF_WEEK => {
  return date.getDay();
};

export const getDayName = (date: Date = new Date()): string => {
  return DAYS_OF_WEEK[date.getDay()] || "";
};

export const getDayOfMonth = (date: Date = new Date()): number => {
  return date.getDate();
};

export const getMonthNumber = (date: Date = new Date()): number => {
  return date.getMonth() + 1;
};

export const getYearAndMonth = (
  date: Date = new Date()
): {
  year: number;
  month: number;
} => {
  return {
    year: date.getFullYear(),
    month: getMonthNumber(date),
  };
};
