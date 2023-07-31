// calendar helpers

import { addDays, isAfter, isBefore, isEqual } from "date-fns";

export const getDatesBetween = (startDate: Date, endDate: Date) => {
  const dates: Date[] = [];

  let tempDate = startDate;
  while (tempDate <= endDate) {
    dates.push(new Date(tempDate));
    tempDate = addDays(tempDate, 1);
  }

  return dates;
};

export const isDateBetween = (
  date: Date,
  from: Date,
  to: Date,
  inclusivity: "()" | "[]" | "(]" | "[)" = "()"
) => {
  if (!["()", "[]", "(]", "[)"].includes(inclusivity)) {
    throw new Error("Inclusivity parameter must be one of (), [], (], [)");
  }

  const isBeforeEqual = inclusivity[0] === "[",
    isAfterEqual = inclusivity[1] === "]";

  return (
    (isBeforeEqual
      ? isEqual(from, date) || isBefore(from, date)
      : isBefore(from, date)) &&
    (isAfterEqual ? isEqual(to, date) || isAfter(to, date) : isAfter(to, date))
  );
};
