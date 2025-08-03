"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Calendar, BarChart2 } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useDrinkStats } from '@/hooks/use-drink-stats';
import { SailingVisual } from './SailingVisual';
import { AnimatedStatCard } from './AnimatedStatCard';
import { toast } from 'sonner';

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

const STREAK_MILESTONES = [7, 14, 30, 60, 90, 182, 365];

export const DashboardView = ({ direction }: { direction: number }) => {
  const { drinks, triggerConfetti } = useData();
  const { drinksThisWeek, currentStreak, longestStreak, weather } = useDrinkStats(drinks);
  const prevLongestStreakRef = useRef<number>();
  const prevCurrentStreakRef = useRef<number>();

  useEffect(() => {
    // Check for new longest streak record
    if (prevLongestStreakRef.current !== undefined && longestStreak > prevLongestStreakRef.current) {
      toast.success(`🎉 New record! You've reached a new longest streak of ${longestStreak} days!`);
      triggerConfetti();
    }
    prevLongestStreakRef.current = longestStreak;

    // Check for current streak milestones
    if (prevCurrentStreakRef.current !== undefined && currentStreak > prevCurrentStreakRef.current) {
        if (STREAK_MILESTONES.includes(currentStreak)) {
            toast.success(`🥳 Awesome! You've hit a ${currentStreak}-day sober streak!`);
            triggerConfetti();
        }
    }
    prevCurrentStreakRef.current = currentStreak;

  }, [longestStreak, currentStreak, triggerConfetti]);

  return (
    <motion.div
      custom={direction}
      variants={viewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
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