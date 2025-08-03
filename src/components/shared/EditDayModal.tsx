"use client";

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, X } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { formatDate } from '@/lib/utils';

interface EditDayModalProps {
  date: Date;
  isOpen: boolean;
  onClose: () => void;
}

export const EditDayModal = ({ date, isOpen, onClose }: EditDayModalProps) => {
  const { drinks, setDrinksForDate } = useData();
  
  const drinksOnDateCount = useMemo(() => {
    if (!isOpen) return 0;
    const dateStr = formatDate(date);
    return drinks.filter(d => d.drink_date === dateStr).length;
  }, [drinks, date, isOpen]);

  const [drinkCount, setDrinkCount] = useState(drinksOnDateCount);

  useEffect(() => {
    setDrinkCount(drinksOnDateCount);
  }, [drinksOnDateCount]);

  if (!isOpen) return null;

  const handleSave = async () => {
    await setDrinksForDate(date, drinkCount);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-sm relative"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">Edit Drinks</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <div className="flex items-center justify-center space-x-6 my-8">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setDrinkCount(c => Math.max(0, c - 1))} className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full"><Minus /></motion.button>
          <span className="text-5xl font-bold w-20 text-center">{drinkCount}</span>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setDrinkCount(c => c + 1)} className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full"><Plus /></motion.button>
        </div>

        <div className="flex justify-center space-x-4">
          <motion.button whileHover={{ scale: 1.05 }} className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg" onClick={handleSave}>Save</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} className="px-8 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg" onClick={onClose}>Cancel</motion.button>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><X size={24} /></button>
      </motion.div>
    </motion.div>
  );
};