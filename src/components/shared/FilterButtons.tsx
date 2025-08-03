"use client";

import { motion } from 'framer-motion';

type FilterOption = {
  label: string;
  value: string;
};

interface FilterButtonsProps {
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export const FilterButtons = ({ options, selected, onSelect }: FilterButtonsProps) => (
  <div className="flex w-full bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
    {options.map(option => (
      <button
        key={option.value}
        onClick={() => onSelect(option.value)}
        className={`w-full px-3 py-1.5 text-sm font-semibold rounded-md transition-colors relative ${
          selected === option.value
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-300'
        }`}
      >
        <span className="relative z-10">{option.label}</span>
        {selected === option.value && (
          <motion.div
            layoutId="filter-button-bg"
            className="absolute inset-0 bg-white dark:bg-gray-800 rounded-md shadow-sm"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </button>
    ))}
  </div>
);