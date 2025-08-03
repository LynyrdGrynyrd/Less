"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '@/context/DataContext';
import { getStartOfWeek } from '@/lib/utils';
import { FilterButtons } from '@/components/shared/FilterButtons';

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

export const StatsView = ({ direction }: { direction: number }) => {
  const { drinks } = useData();
  const [period, setPeriod] = useState('week');

  const chartData = useMemo(() => {
    const now = new Date();
    const dataMap = new Map<string, number>();

    if (period === 'week') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      days.forEach(day => dataMap.set(day, 0));
      const startOfWeek = getStartOfWeek(now);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      drinks.filter(d => {
          const drinkDate = new Date(d.drink_date);
          return drinkDate >= startOfWeek && drinkDate <= endOfWeek;
      }).forEach(drink => {
        const dayIndex = new Date(drink.drink_date).getUTCDay();
        const dayName = days[dayIndex];
        dataMap.set(dayName, (dataMap.get(dayName) || 0) + 1);
      });
    } else if (period === 'month') {
      for (let i = 1; i <= 4; i++) dataMap.set(`Week ${i}`, 0);
      drinks.filter(d => new Date(d.drink_date).getMonth() === now.getMonth() && new Date(d.drink_date).getFullYear() === now.getFullYear())
      .forEach(drink => {
        const weekOfMonth = Math.ceil(new Date(drink.drink_date).getUTCDate() / 7);
        const key = `Week ${Math.min(weekOfMonth, 4)}`;
        dataMap.set(key, (dataMap.get(key) || 0) + 1);
      });
    } else { // year
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      months.forEach(month => dataMap.set(month, 0));
      drinks.forEach(drink => {
        if (new Date(drink.drink_date).getFullYear() === now.getFullYear()) {
            const monthIndex = new Date(drink.drink_date).getUTCMonth();
            const monthName = months[monthIndex];
            dataMap.set(monthName, (dataMap.get(monthName) || 0) + 1);
        }
      });
    }

    return Array.from(dataMap, ([name, drinks]) => ({ name, drinks }));
  }, [drinks, period]);

  return (
    <motion.div
      custom={direction}
      variants={viewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-4"
    >
      <h2 className="text-2xl font-bold mb-4">Statistics</h2>
      <div className="mb-4">
        <FilterButtons
          options={[{ label: 'Week', value: 'week' }, { label: 'Month', value: 'month' }, { label: 'Year', value: 'year' }]}
          selected={period}
          onSelect={setPeriod}
        />
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-80">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Consumption Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
            <YAxis allowDecimals={false} tick={{ fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563', color: '#ffffff', borderRadius: '0.5rem' }}
              cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
            />
            <Bar dataKey="drinks" fill="#60a5fa" name="Drinks" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};