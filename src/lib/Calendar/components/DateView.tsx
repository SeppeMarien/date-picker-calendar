import { isDateBetween } from '@/utils/date';
import { cn } from '@/utils/tailwind';
import { cva } from 'class-variance-authority';
import { type ReactNode } from 'react';

export type DateInfoRenderer = {
  date: Date;
  data?: unknown;
};

type DateViewProps = {
  viewDate: Date;
  startSelectedDate?: Date;
  endSelectedDate?: Date;
  viewMonth: number;
  isDisabled: boolean;
  dateInfo?: (dateInfoRenderer: DateInfoRenderer) => ReactNode;
  onMouseDown: (viewDate: Date) => void;
  onMouseUp: (viewDate: Date) => void;
};

const calendarDateVariants = cva('flex cursor-pointer flex-col', {
  variants: {
    variant: {
      default: '',
      selected: 'bg-secondary/25',
      disabled: 'cursor-not-allowed opacity-25 bg-gray-300',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const DateView = ({
  viewDate,
  startSelectedDate,
  endSelectedDate,
  viewMonth,
  isDisabled = false,
  dateInfo,
  onMouseDown,
  onMouseUp,
}: DateViewProps) => {
  const isSelected =
    !!startSelectedDate &&
    isDateBetween(
      viewDate,
      startSelectedDate,
      endSelectedDate || startSelectedDate,
      '[]'
    );
  return (
    <div
      key={viewDate.toString()}
      className={cn(
        calendarDateVariants({
          variant: getCalendarVariant(isSelected, isDisabled),
        })
      )}
      onMouseDown={() => !isDisabled && onMouseDown(viewDate)}
      onMouseOver={(e) => !isDisabled && e.buttons === 1 && onMouseUp(viewDate)}
    >
      <p
        className={`w-full select-none text-right ${
          viewDate.getMonth() != viewMonth ? 'text-gray-500' : 'font-bold'
        }`}
      >
        {viewDate.getDate()}
      </p>
      {dateInfo && dateInfo({ date: viewDate })}
    </div>
  );
};

const getCalendarVariant = (isSelected: boolean, isDisabled: boolean) => {
  if (isDisabled) return 'disabled';
  if (isSelected) return 'selected';
  return 'default';
};
