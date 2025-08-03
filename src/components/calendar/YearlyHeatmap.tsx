"use client";

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { motion } from 'framer-motion';

interface YearlyHeatmapProps {
  year: number;
  onYearChange: (newYear: number) => void;
  onMonthClick: (monthIndex: number) => void;
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getColor = (count: number) => {
  if (count === 0) return 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
  if (count <= 10) return 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200';
  if (count <= 20) return 'bg-blue-400 dark:bg-blue-600 text-white dark:text-white';
  return 'bg-blue-600 dark:bg-blue-400 text-white dark:text-black';
};

export const YearlyHeatmap = ({ year, onYearChange, onMonthClick }: YearlyHeatmapProps) => {
  const { drinks } = useData();

  const monthlyDrinkCounts = useMemo(() => {
    const counts = Array(12).fill(0);
    drinks.forEach(drink => {
      const drinkDate = new Date(drink.drink_date);
      if (drinkDate.getFullYear() === year) {
        counts[drinkDate.getUTCMonth()]++;
      }
    });
    return counts;
  }, [drinks, year]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{year} Overview</h3>
        <div className="flex items-center space-x-2">
          <button onClick={() => onYearChange(year - 1)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeft size={20} /></button>
          <button onClick={() => onYearChange(year + 1)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {monthlyDrinkCounts.map((count, index) => (
          <motion.div
            key={index}
            onClick={() => onMonthClick(index)}
            className={`p-4 rounded-lg cursor-pointer text-center ${getColor(count)}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="font-bold text-lg">{monthNames[index]}</div>
            <div className="text-sm">{count} {count === 1 ? 'drink' : 'drinks'}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};