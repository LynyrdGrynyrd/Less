"use client";

import ReactConfetti from 'react-confetti';
import useWindowSize from '@/hooks/use-window-size';

export const ConfettiCannon = () => {
  const { width, height } = useWindowSize();

  return (
    <ReactConfetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={500}
      tweenDuration={10000}
      style={{ zIndex: 1000 }}
    />
  );
};