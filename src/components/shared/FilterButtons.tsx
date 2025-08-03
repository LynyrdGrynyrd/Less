"use client";

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
  <div className="flex space-x-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
    {options.map(option => (
      <button
        key={option.value}
        onClick={() => onSelect(option.value)}
        className={`w-full px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
          selected === option.value
            ? 'bg-white dark:bg-gray-800 text-blue-500 shadow'
            : 'text-gray-600 dark:text-gray-300'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);