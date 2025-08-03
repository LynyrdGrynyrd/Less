"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Droplet } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useDrinkStats } from '@/hooks/use-drink-stats';
import { formatDate } from '@/lib/utils';
import { FilterButtons } from '@/components/shared/FilterButtons';
import { YearlyHeatmap } from './YearlyHeatmap';

interface CalendarViewProps {
  onDayClick: (date: Date) => void;
}

export const CalendarView = ({ onDayClick }: CalendarViewProps) => {
  const { drinks } = useData();
  const { drinksByDate } = useDrinkStats(drinks);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState('month');

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ArrowLeft size={20} /></button>
      <span className="text-lg font-bold">{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate)}</span>
      <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ArrowLeft size={20} className="transform rotate-180" /></button>
    </div>
  );

  const renderDays = () => (
    <div className="grid grid-cols-7 mb-2">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div className="text-center font-medium text-sm text-gray-500" key={day}>{day}</div>)}
    </div>
  );

  const renderCells = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    const endDate = new Date(monthEnd);
    if (monthEnd.getDay() !== 6) {
      endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
    }

    const rows = [];
    let days = [];
    let day = new Date(startDate);

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = formatDate(day);
        const cloneDay = new Date(day);
        const drinksCount = drinksByDate.get(formattedDate) || 0;
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();

        let bgColor = 'bg-gray-100 dark:bg-gray-700';
        if (drinksCount > 0) bgColor = 'bg-blue-200 dark:bg-blue-800';
        if (drinksCount > 2) bgColor = 'bg-blue-300 dark:bg-blue-700';
        if (drinksCount > 4) bgColor = 'bg-blue-400 dark:bg-blue-600';

        days.push(
          <div key={day.toISOString()} onClick={() => onDayClick(cloneDay)} className={`p-1 h-16 flex flex-col justify-start items-center rounded-md cursor-pointer transition-colors duration-300 ${isCurrentMonth ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'} ${isCurrentMonth ? bgColor : 'bg-gray-50 dark:bg-gray-800'}`}>
            <span className="text-sm">{day.getDate()}</span>
            {isCurrentMonth && drinksCount > 0 && (
              <div className="flex items-center mt-1 text-xs"><Droplet size={12} className="text-blue-500" /><span className="ml-1 font-bold">{drinksCount}</span></div>
            )}
          </div>
        );
        day.setDate(day.getDate() + 1);
      }
      rows.push(<div className="grid grid-cols-7 gap-1" key={day.toISOString()}>{days}</div>);
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="p-4"
    >
      <h2 className="text-2xl font-bold mb-4">Calendar</h2>
      <div className="mb-4">
        <FilterButtons options={[{label: 'Month', value: 'month'}, {label: 'Year', value: 'year'}]} selected={viewType} onSelect={setViewType} />
      </div>
      {viewType === 'month' ? (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
      ) : (
        <YearlyHeatmap onDayClick={onDayClick} />
      )}
    </motion.div>
  );
};