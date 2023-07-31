import { getDatesBetween, isDateBetween } from '@/utils/date';
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
  isSameDay,
  isDate,
} from 'date-fns';
import { type ReactNode, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { DateView, type DateInfoRenderer } from './components/DateView';
import { Button } from '@/components/button';

type DateRange = {
  startDate: Date;
  endDate: Date;
};

type CalendarOnChangeArguments = Partial<DateRange>;

type CalendarProps = {
  disabledDates?: Array<Date | DateRange>;
  className?: string;
  dateInfo?: (dateInfo: DateInfoRenderer) => ReactNode;
  onChange?: ({ startDate, endDate }: CalendarOnChangeArguments) => void;
};

export const Calendar = ({
  disabledDates,
  className = '',
  onChange,
  dateInfo,
}: CalendarProps) => {
  const [date, setDate] = useState(startOfMonth(new Date()));
  const [startSelectedDate, setStartSelectedDate] = useState<Date>();
  const [endSelectedDate, setEndSelectedDate] = useState<Date>();
  const [startOfCurrentView, setStartOfCurrentView] = useState(
    startOfMonth(date)
  );
  const [endOfCurrentView, setEndOfCurrentView] = useState(endOfMonth(date));
  const datesInView = getDatesBetween(startOfCurrentView, endOfCurrentView);

  useEffect(() => {
    if (!onChange) return;
    onChange({ startDate: startSelectedDate, endDate: endSelectedDate });
  }, [startSelectedDate, endSelectedDate]);

  useEffect(() => {
    const startView = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
    const endView = addDays(startView, 41);
    setStartOfCurrentView(startView);
    setEndOfCurrentView(endView);
  }, [date]);

  const handlePrev = () => {
    setDate(subMonths(date, 1));
  };

  const handleNext = () => {
    setDate(addMonths(date, 1));
  };

  const handleMouseDown = (date: Date) => {
    if (startSelectedDate && isSameDay(date, startSelectedDate)) {
      setStartSelectedDate(undefined);
      return;
    }
    setStartSelectedDate(date);
    setEndSelectedDate(undefined);
  };

  const handleMouseUp = (date: Date) => {
    if (!startSelectedDate || isSameDay(startSelectedDate, date)) return;

    if (date < startSelectedDate) {
      const datesBetween = getDatesBetween(date, startSelectedDate);
      const containsDisabled = disabledDates?.some((disabledDate) => {
        // prettier-ignore
        if (isDate(disabledDate)) return isDateBetween(disabledDate as Date, date, startSelectedDate);

        return datesBetween.some((date) =>
          isSameDay(date, (disabledDate as DateRange).endDate)
        );
      });

      if (containsDisabled) {
        setStartSelectedDate(undefined);
        setEndSelectedDate(undefined);
        return;
      }

      if (!endSelectedDate) setEndSelectedDate(startSelectedDate);
      setStartSelectedDate(date);
      return;
    }

    const datesBetween = getDatesBetween(startSelectedDate, date);

    const containsDisabled = disabledDates?.some((disabledDate) =>
      isDate(disabledDate)
        ? isDateBetween(disabledDate as Date, startSelectedDate, date)
        : datesBetween.some((date) =>
            isSameDay(date, (disabledDate as DateRange).startDate)
          )
    );

    if (containsDisabled) {
      setStartSelectedDate(undefined);
      setEndSelectedDate(undefined);
      return;
    }

    setEndSelectedDate(date);
  };

  return (
    <div className={`flex h-full flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold">{format(date, 'MMMM yyyy')}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handlePrev}>Previous</Button>
          <Button onClick={handleNext}>Next</Button>
        </div>
      </div>
      <div className="grid flex-grow grid-cols-7 grid-rows-[35px_repeat(6,1fr)] rounded border border-primary [&>*]:border-collapse [&>*]:border [&>*]:p-2">
        <Header>Mon</Header>
        <Header>Tue</Header>
        <Header>Wed</Header>
        <Header>Thu</Header>
        <Header>Fri</Header>
        <Header>Sat</Header>
        <Header>Sun</Header>
        {datesInView.map((dateInView) => {
          const isDisabled = !!disabledDates?.find((disabledDate) =>
            isDate(disabledDate)
              ? isSameDay(disabledDate as Date, dateInView)
              : isDateBetween(
                  dateInView,
                  (disabledDate as DateRange).startDate,
                  (disabledDate as DateRange).endDate,
                  '[]'
                )
          );
          return (
            <DateView
              key={dateInView.toString()}
              viewDate={dateInView}
              viewMonth={date.getMonth()}
              startSelectedDate={startSelectedDate}
              endSelectedDate={endSelectedDate}
              dateInfo={dateInfo}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              isDisabled={isDisabled}
            />
          );
        })}
      </div>
    </div>
  );
};
