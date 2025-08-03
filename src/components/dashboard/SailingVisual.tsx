"use client";

import { motion } from 'framer-motion';
import { Sun, CloudRain, Zap } from 'lucide-react';
import { WeatherType } from '@/hooks/use-drink-stats';

interface SailingVisualProps {
  weather: WeatherType;
}

export const SailingVisual = ({ weather }: SailingVisualProps) => {
    const conditions = {
        sunny: {
            sky: 'from-blue-400 to-cyan-200',
            message: "Smooth sailing! A beautiful day for mindful choices.",
            icon: <Sun size={32} className="text-yellow-300" />
        },
        rainy: {
            sky: 'from-slate-500 to-slate-400',
            message: "A bit of rain. A good time to reflect and stay the course.",
            icon: <CloudRain size={32} className="text-blue-200" />
        },
        stormy: {
            sky: 'from-gray-800 to-gray-700',
            message: "Rough seas ahead. Stay strong and navigate carefully.",
            icon: <Zap size={32} className="text-yellow-400" />
        }
    };

    const currentCondition = conditions[weather] || conditions.sunny;
    const wavePath = "M0,50 C150,0 250,100 400,50 S550,0 700,50 S850,100 1000,50 V100 H0 Z";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 overflow-hidden"
        >
            <div className={`relative h-56 w-full rounded-lg bg-gradient-to-b ${currentCondition.sky} flex items-center justify-center overflow-hidden`}>
                {weather === 'sunny' && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }} className="absolute top-5 right-5 w-12 h-12 bg-yellow-300 rounded-full shadow-lg" />}
                {(weather === 'rainy' || weather === 'stormy') && (
                    <>
                        <motion.div animate={{ x: [-30, 30, -30] }} transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }} className="absolute top-4 left-10 w-28 h-14 bg-gray-300 dark:bg-gray-500 rounded-full opacity-80" />
                        <motion.div animate={{ x: [40, -40, 40] }} transition={{ repeat: Infinity, duration: 30, ease: 'easeInOut' }} className="absolute top-8 right-12 w-36 h-16 bg-gray-300 dark:bg-gray-500 rounded-full opacity-80" />
                    </>
                )}
                {weather === 'stormy' && (
                    <motion.div className="absolute top-0 right-1/4" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0, 0.5, 0] }} transition={{ repeat: Infinity, duration: 4, delay: Math.random() * 2 }}>
                        <Zap size={48} className="text-yellow-300" />
                    </motion.div>
                )}
                {weather === 'rainy' && Array.from({ length: 30 }).map((_, i) => (
                     <motion.div key={i} className="absolute w-0.5 h-4 bg-blue-200" style={{ left: `${Math.random() * 100}%` }}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 200, opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1 + Math.random(), delay: Math.random() * 2 }}
                     />
                ))}
                <motion.svg className="absolute bottom-0 left-0 w-full h-2/5" viewBox="0 0 1000 100">
                    <motion.path d={wavePath} fill={weather === 'sunny' ? '#3b82f6' : weather === 'rainy' ? '#475569' : '#111827'}
                        animate={{ x: ['-200px', '0px'] }}
                        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                    />
                     <motion.path d={wavePath} fill={weather === 'sunny' ? 'rgba(96, 165, 250, 0.5)' : weather === 'rainy' ? 'rgba(100, 116, 139, 0.5)' : 'rgba(31, 41, 55, 0.5)'}
                        animate={{ x: ['0px', '-200px'] }}
                        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                    />
                </motion.svg>
                 <motion.div
                    className="absolute bottom-6 z-10"
                    animate={{
                        rotate: weather === 'stormy' ? [0, -8, 8, -8, 0] : [0, -3, 3, -3, 0],
                        y: weather !== 'sunny' ? [0, 4, -4, 0] : [0, 2, -2, 0],
                    }}
                    transition={{ repeat: Infinity, duration: weather === 'stormy' ? 2.5 : 4, ease: 'easeInOut' }}
                >
                    <div className="w-20 h-8 bg-yellow-800 rounded-t-full" style={{ clipPath: 'polygon(0 20%, 100% 20%, 100% 100%, 0% 100%)' }}/>
                    <div className="absolute -top-20 left-1/2 -ml-1 w-2 h-20 bg-gray-700">
                        <motion.div
                            className="w-16 h-20 bg-white origin-left"
                            style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}
                            animate={{ scaleX: weather === 'stormy' ? [1, 0.8, 1] : [1, 0.95, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        />
                    </div>
                </motion.div>
            </div>
            <div className="flex items-center pt-4">
                <div className="mr-4">{currentCondition.icon}</div>
                <p className="text-gray-600 dark:text-gray-300">{currentCondition.message}</p>
            </div>
        </motion.div>
    );
};