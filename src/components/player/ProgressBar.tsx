import React, { useState, useRef, useCallback } from 'react';
import { formatTime } from '@/utils/formatTime';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const calculateTime = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || duration === 0) return 0;
      const rect = progressRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      return (x / rect.width) * duration;
    },
    [duration]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const time = calculateTime(e);
    onSeek(time);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const time = calculateTime(e);
    setHoverTime(time);
    if (isDragging) {
      onSeek(time);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    setIsDragging(false);
  };

  return (
    <div className="w-full">
      <div
        ref={progressRef}
        className="relative h-1.5 bg-white/10 rounded-full cursor-pointer group"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-pink to-neon-cyan rounded-full transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ left: `calc(${progress}% - 8px)` }}
        >
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-neon-pink to-neon-cyan" />
        </div>
        {hoverTime !== null && (
          <div
            className="absolute -top-8 transform -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-xs text-white whitespace-nowrap pointer-events-none"
            style={{ left: `${(hoverTime / duration) * 100}%` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>
      <div className="flex justify-between mt-1.5 text-xs text-white/60">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};
