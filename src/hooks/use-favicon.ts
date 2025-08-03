"use client";

import { useEffect } from 'react';

const setFavicon = (emoji: string) => {
  const canvas = document.createElement('canvas');
  canvas.height = 64;
  canvas.width = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.font = "60px 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 32, 32);
  }
  
  let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'shortcut icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.type = 'image/x-icon';
  link.href = canvas.toDataURL();
};

export const useFavicon = (emoji: string) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.document) {
      setFavicon(emoji);
    }
  }, [emoji]);
};