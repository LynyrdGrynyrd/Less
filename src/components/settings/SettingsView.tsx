"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Download } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { Drink } from '@/types';
import { ThemeToggle } from './ThemeToggle';

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

export const SettingsView = ({ direction }: { direction: number }) => {
  const { drinks, importDrinks } = useData();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const arrayToCsv = (data: Drink[], template = false) => {
    const header = 'drink_date\n';
    if (template) return header;
    const rows = data.map(row => row.drink_date);
    return header + rows.join('\n');
  };

  const handleExport = () => {
    if (drinks.length === 0) {
        toast.info("You don't have any data to export yet.");
        return;
    }
    const csv = arrayToCsv(drinks);
    downloadCsv(csv, 'drink_history.csv');
    toast.success("Your data has been exported.");
  };

  const handleExportTemplate = () => {
    const csv = arrayToCsv([], true);
    downloadCsv(csv, 'drink_history_template.csv');
  };
  
  const downloadCsv = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        const header = lines.shift()?.trim();
        
        if (header !== 'drink_date') {
            throw new Error("Invalid CSV header. Must be 'drink_date'.");
        }
        
        const importedDrinks = lines.map(line => {
            const date = new Date(line.trim());
            if (isNaN(date.getTime())) throw new Error(`Invalid date format: ${line.trim()}`);
            return { drink_date: date.toISOString().split('T')[0] };
        });

        if (window.confirm(`Found ${importedDrinks.length} records. This will add them to your history. Are you sure?`)) {
            await importDrinks(importedDrinks);
        }
      } catch (error) {
        if (error instanceof Error) {
            toast.error(`Import failed: ${error.message}`);
        } else {
            toast.error("An unknown error occurred during import.");
        }
      } finally {
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <motion.div
      custom={direction}
      variants={viewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-4"
    >
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Appearance</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Choose how the app looks on your device.</p>
          <ThemeToggle />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold">Data Management (CSV)</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Import and export your drink history. The CSV must have one column with the header `drink_date` and dates in YYYY-MM-DD format.</p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"><Upload size={18} className="mr-2"/>Import History</button>
            <button onClick={handleExport} className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors"><Download size={18} className="mr-2"/>Export History</button>
            <button onClick={handleExportTemplate} className="flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition-colors"><Download size={18} className="mr-2"/>Export Template</button>
            <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv" className="hidden" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};