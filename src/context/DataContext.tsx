"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Drink } from '@/types';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface DataContextType {
  user: User | null;
  drinks: Drink[];
  loading: boolean;
  setDrinksForDate: (date: Date, count: number) => Promise<void>;
  importDrinks: (newDrinks: { drink_date: string }[]) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (!session?.user) {
        await supabase.auth.signInAnonymously();
      }
      setLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      const fetchDrinks = async () => {
        const { data, error } = await supabase
          .from('drinks')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          toast.error("Could not fetch your drink history.");
        } else {
          const formattedData = data.map(d => ({...d, drink_date: d.drink_date.split('T')[0]}));
          setDrinks(formattedData || []);
        }
      };
      fetchDrinks();
    }
  }, [user]);
  
  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('realtime-drinks')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'drinks',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
            const newDrink = {...payload.new, drink_date: payload.new.drink_date.split('T')[0]} as Drink;
            setDrinks(currentDrinks => [...currentDrinks, newDrink].sort((a, b) => new Date(b.drink_date).getTime() - new Date(a.drink_date).getTime()));
        }
        if (payload.eventType === 'DELETE') {
            const oldId = payload.old.id;
            setDrinks(currentDrinks => currentDrinks.filter(d => d.id !== oldId));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, [user]);

  const addDrinks = async (date: Date, count: number) => {
    if (!user || count <= 0) return;
    const dateString = formatDate(date);
    const newDrinks = Array.from({ length: count }, () => ({
      user_id: user.id,
      drink_date: dateString,
    }));
    const { error } = await supabase.from('drinks').insert(newDrinks);
    if (error) toast.error("Failed to add drinks.");
  };

  const removeDrinks = async (date: Date, count: number) => {
    if (!user || count <= 0) return;
    const dateString = formatDate(date);
    const drinksOnDate = drinks.filter(d => d.drink_date === dateString);
    const drinksToRemove = drinksOnDate.slice(0, count).map(d => d.id);

    if (drinksToRemove.length > 0) {
        const { error } = await supabase.from('drinks').delete().in('id', drinksToRemove);
        if (error) toast.error("Failed to remove drinks.");
    }
  };

  const setDrinksForDate = async (date: Date, newCount: number) => {
    const dateString = formatDate(date);
    const currentCount = drinks.filter(d => d.drink_date === dateString).length;
    const difference = newCount - currentCount;

    if (difference > 0) {
      await addDrinks(date, difference);
    } else if (difference < 0) {
      await removeDrinks(date, Math.abs(difference));
    }
    toast.success("Your log has been updated.");
  };

  const importDrinks = async (newDrinks: { drink_date: string }[]) => {
    if (!user) return;
    const drinksToInsert = newDrinks.map(d => ({
        user_id: user.id,
        drink_date: new Date(d.drink_date).toISOString().split('T')[0]
    }));

    const { error } = await supabase.from('drinks').insert(drinksToInsert);
    if (error) {
        toast.error(`Import failed: ${error.message}`);
    } else {
        toast.success(`${drinksToInsert.length} records imported successfully!`);
        const { data } = await supabase.from('drinks').select('*').eq('user_id', user.id);
        if (data) {
            const formattedData = data.map(d => ({...d, drink_date: d.drink_date.split('T')[0]}));
            setDrinks(formattedData);
        }
    }
  };

  return (
    <DataContext.Provider value={{ user, drinks, loading, setDrinksForDate, importDrinks }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};