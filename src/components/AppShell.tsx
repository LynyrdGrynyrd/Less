"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart, Calendar as CalendarIcon, BarChart2, Settings, Plus } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { CalendarView } from '@/components/calendar/CalendarView';
import { StatsView } from '@/components/stats/StatsView';
import { SettingsView } from '@/components/settings/SettingsView';
import { EditDayModal } from '@/components/shared/EditDayModal';
import { ConfettiCannon } from '@/components/shared/ConfettiCannon';
import { useDrinkStats } from '@/hooks/use-drink-stats';
import { useFavicon } from '@/hooks/use-favicon';
import { DashboardSkeleton } from './dashboard/DashboardSkeleton';

type View = 'dashboard' | 'calendar' | 'stats' | 'settings';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'stats', label: 'Stats', icon: BarChart },
    { id: 'settings', label: 'Settings', icon: Settings },
] as const;

export const AppShell = () => {
  const { loading, showConfetti, drinks } = useData();
  const { weather } = useDrinkStats(drinks);
  const [view, setView] = useState<View>('dashboard');
  const [direction, setDirection] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(new Date());

  const faviconEmoji = {
    sunny: '☀️',
    rainy: '🌧️',
    stormy: '⛈️',
  };

  useFavicon(faviconEmoji[weather]);

  const changeView = (newView: View) => {
    if (newView === view) return;
    const oldIndex = navItems.findIndex(item => item.id === view);
    const newIndex = navItems.findIndex(item => item.id === newView);
    setDirection(newIndex > oldIndex ? 1 : -1);
    setView(newView);
  };

  const handleDayClick = (date: Date) => {
    setModalDate(date);
    setIsModalOpen(true);
  };

  const renderView = () => {
    switch (view) {
      case 'calendar':
        return <CalendarView key="calendar" onDayClick={handleDayClick} direction={direction} />;
      case 'stats':
        return <StatsView key="stats" direction={direction} />;
      case 'settings':
        return <SettingsView key="settings" direction={direction} />;
      case 'dashboard':
      default:
        return <DashboardView key="dashboard" direction={direction} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      {showConfetti && <ConfettiCannon />}
      <div className="container mx-auto max-w-4xl pb-24 relative overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {renderView()}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && <EditDayModal date={modalDate} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>

      <motion.button
        className="fixed bottom-24 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg z-40"
        onClick={() => handleDayClick(new Date())}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Add Drink for Today"
      >
        <Plus size={24} />
      </motion.button>

      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <nav className="container mx-auto max-w-4xl flex justify-around p-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => changeView(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg w-24 transition-colors ${
                view === item.id ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs mt-1 capitalize">{item.label}</span>
            </button>
          ))}
        </nav>
      </footer>
    </div>
  );
};