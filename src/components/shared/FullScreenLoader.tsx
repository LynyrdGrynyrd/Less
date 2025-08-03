"use client";

import { Loader } from 'lucide-react';

export const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <Loader className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
};