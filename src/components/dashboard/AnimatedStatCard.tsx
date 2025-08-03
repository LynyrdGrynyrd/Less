"use client";

import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedStatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  unit?: string;
}

export const AnimatedStatCard = ({ title, value, icon, color, unit = '' }: AnimatedStatCardProps) => {
  const spring = useSpring(value, { stiffness: 75, damping: 25 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={`p-3 rounded-full mr-4 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <div className="flex items-baseline">
          <motion.p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{display}</motion.p>
          {unit && <span className="text-lg ml-1 text-gray-600 dark:text-gray-400">{unit}</span>}
        </div>
      </div>
    </motion.div>
  );
};