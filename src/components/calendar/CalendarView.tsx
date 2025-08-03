"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { useDrinkStats } from '@/hooks/use-drink-stats';
import { formatDate } from '@/lib/utils';
import { FilterButtons } from '@/components/shared/FilterButtons';
import { YearlyHeatmap } from './YearlyHeatmap';
import { Calendar } from '@/components/ui/calendar';

interface CalendarViewProps {
  onDayClick: (date: Date) => void;
  direction: number;
}

const viewVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 30 },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 30 : -30,
    opacity: 0,
    transition: { type: 'spring', stiffness: 260, damping: 30 },
  }),
};

export const CalendarView = ({ onDayClick, direction }: CalendarViewProps) => {
  const { drinks } = useData();
  const { drinksByDate } = useDrinkStats(drinks);
  const [viewType, setViewType] = useState('month');
  const [displayDate, setDisplayDate] = useState(new Date());

  const modifiers = useMemo(() => ({
    level1: (date: Date) => {
      const count = drinksByDate.get(formatDate(date)) || 0;
      return count > 0 && count <= 1;
    },
    level2: (date: Date) => {
      const count = drinksByDate.get(formatDate(date)) || 0;
      return count > 1 && count <= 3;
    },
    level3: (date: Date) => {
      const count = drinksByDate.get(formatDate(date)) || 0;
      return count > 3;
    },
  }), [drinksByDate]);

  const modifiersClassNames = {
    level1: 'day-level-1',
    level2: 'day-level-2',
    level3: 'day-level-3',
  };

  const handleMonthClick = (monthIndex: number) => {
    setDisplayDate(new Date(displayDate.getFullYear(), monthIndex, 1));
    setViewType('month');
  };

  const handleYearChange = (newYear: number) => {
    setDisplayDate(new Date(newYear, displayDate.getMonth(), 1));
  };

  return (
    <motion.div
      custom={direction}
      variants={viewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-4"
    >
      <h2 className="text-2xl font-bold mb-4">Calendar</h2>
      <div className="mb-4">
        <FilterButtons options={[{label: 'Month', value: 'month'}, {label: 'Year', value: 'year'}]} selected={viewType} onSelect={setViewType} />
      </div>
      {viewType === 'month' ? (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-center">
          <Calendar
            mode="single"
            onSelect={(date) => date && onDayClick(date)}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="p-0"
            month={displayDate}
            onMonthChange={setDisplayDate}
          />
        </div>
      ) : (
        <YearlyHeatmap 
          year={displayDate.getFullYear()}
          onYearChange={handleYearChange}
          onMonthClick={handleMonthClick}
        />
      )}
    </motion.div>
  );
};