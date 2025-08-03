"use client";

import { motion } from 'framer-motion';
import { Droplet, Calendar, BarChart2 } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useDrinkStats } from '@/hooks/use-drink-stats';
import { SailingVisual } from './SailingVisual';
import { AnimatedStatCard } from './AnimatedStatCard';

export const DashboardView = () => {
  const { drinks } = useData();
  const { drinksThisWeek, currentStreak, longestStreak, weather } = useDrinkStats(drinks);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="p-4"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Your mindful drinking journey.</p>
      <SailingVisual weather={weather} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <AnimatedStatCard title="Drinks This Week" value={drinksThisWeek} icon={<Droplet size={24} className="text-white"/>} color="bg-blue-400" />
        <AnimatedStatCard title="Current Streak" value={currentStreak} unit="days" icon={<Calendar size={24} className="text-white"/>} color="bg-green-400" />
        <AnimatedStatCard title="Longest Streak" value={longestStreak} unit="days" icon={<BarChart2 size={24} className="text-white"/>} color="bg-purple-400" />
      </div>
    </motion.div>
  );
};