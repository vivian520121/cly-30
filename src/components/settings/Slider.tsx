import React from 'react';
import { cn } from '@/utils/cn';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  unit?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = true,
  unit = '',
  className,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="relative flex-1">
        <div className="absolute h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan rounded-full transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={cn(
            'absolute w-full h-2 opacity-0 cursor-pointer',
            disabled && 'cursor-not-allowed'
          )}
        />
      </div>
      {showValue && (
        <span className="text-sm font-medium text-white/80 min-w-[60px] text-right">
          {value}{unit}
        </span>
      )}
    </div>
  );
};
