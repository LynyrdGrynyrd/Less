"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, LogOut } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { Drink } from '@/types';
import { ThemeToggle } from './ThemeToggle';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  const { user, drinks, importDrinks, logout } = useData();
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
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account and session information.</CardDescription>
          </CardHeader>
          <CardContent>
            {user && (
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={logout}>
              <LogOut size={18} className="mr-2"/>
              Log Out
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose how the app looks on your device.</CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeToggle />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Import or export your history. The CSV file must have a single column with the header <code>drink_date</code> and dates in YYYY-MM-DD format.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={() => fileInputRef.current?.click()}><Upload size={18} className="mr-2"/>Import</Button>
              <Button onClick={handleExport} variant="secondary"><Download size={18} className="mr-2"/>Export History</Button>
              <Button onClick={handleExportTemplate} variant="outline"><Download size={18} className="mr-2"/>Export Template</Button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv" className="hidden" />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};