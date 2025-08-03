"use client";

import { useMemo } from 'react';
import { formatDate } from '@/lib/utils';
import { useDrinkStats } from '@/hooks/use-drink-stats';
import { useData } from '@/context/DataContext';

interface YearlyHeatmapProps {
  onDayClick: (date: Date) => void;
}

export const YearlyHeatmap = ({ onDayClick }: YearlyHeatmapProps) => {
  const { drinks } = useData();
  const { drinksByDate } = useDrinkStats(drinks);
  const year = new Date().getFullYear();

  const days = useMemo(() => {
    const dayArray: (Date | null)[] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    let day = new Date(startDate);
    while (day <= endDate) {
      dayArray.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }
    
    const firstDayOfWeek = startDate.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      dayArray.unshift(null);
    }
    return dayArray;
  }, [year]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600';
    if (count <= 1) return 'bg-blue-200 dark:bg-blue-800 hover:bg-blue-300 dark:hover:bg-blue-700';
    if (count <= 3) return 'bg-blue-400 dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-500';
    return 'bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">{year} Overview</h3>
      <div className="grid grid-flow-col grid-rows-7 gap-1 justify-start">
        {days.map((d, index) => {
          if (!d) return <div key={`blank-${index}`} className="w-3 h-3 rounded-sm" />;
          const dateStr = formatDate(d);
          const count = drinksByDate.get(dateStr) || 0;
          return (
            <div
              key={dateStr}
              onClick={() => onDayClick(d)}
              className={`w-3 h-3 rounded-sm cursor-pointer transition-colors ${getColor(count)}`}
              title={`${count} drinks on ${d.toLocaleDateString()}`}
            />
          );
        })}
      </div>
    </div>
  );
};