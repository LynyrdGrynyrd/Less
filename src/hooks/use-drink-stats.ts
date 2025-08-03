"use client";

import { useMemo } from 'react';
import { Drink } from '@/types';
import { formatDate, getStartOfWeek } from '@/lib/utils';

export type WeatherType = 'sunny' | 'rainy' | 'stormy';

export const useDrinkStats = (drinks: Drink[]) => {
  return useMemo(() => {
    if (!drinks) return { currentStreak: 0, longestStreak: 0, drinksThisWeek: 0, weather: 'sunny' as WeatherType, drinksByDate: new Map() };

    const drinksByDate = new Map<string, number>();
    drinks.forEach(drink => {
      const dateStr = drink.drink_date;
      drinksByDate.set(dateStr, (drinksByDate.get(dateStr) || 0) + 1);
    });

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);

    const drinksToday = drinksByDate.get(todayStr) || 0;
    const drinksYesterday = drinksByDate.get(yesterdayStr) || 0;

    let weather: WeatherType = 'sunny';
    if (drinksToday > 2 || (drinksToday + drinksYesterday) > 4) {
      weather = 'stormy';
    } else if (drinksToday > 0 || drinksYesterday > 0) {
      weather = 'rainy';
    }

    const datesWithDrinks = new Set(drinks.map(d => d.drink_date));
    
    let currentStreak = 0;
    let checkDate = new Date();
    while(!datesWithDrinks.has(formatDate(checkDate))) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
        if (currentStreak > 10000) break; // Safety break
    }

    let longestStreak = currentStreak;
    const sortedUniqueDrinkDates = Array.from(datesWithDrinks).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    if (sortedUniqueDrinkDates.length > 1) {
      for (let i = 1; i < sortedUniqueDrinkDates.length; i++) {
        const d1 = new Date(sortedUniqueDrinkDates[i-1]);
        const d2 = new Date(sortedUniqueDrinkDates[i]);
        const diffTime = d2.getTime() - d1.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) - 1;
        if (diffDays > longestStreak) {
          longestStreak = diffDays;
        }
      }
    }

    const startOfWeek = getStartOfWeek(new Date());
    const drinksThisWeek = drinks.filter(d => new Date(d.drink_date) >= startOfWeek).length;

    return { currentStreak, longestStreak, drinksThisWeek, weather, drinksByDate };
  }, [drinks]);
};