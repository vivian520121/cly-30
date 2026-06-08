import React from 'react';
import { cn } from '@/utils/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-8',
  };

  const dotSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const dotTranslateClasses = {
    sm: 'translate-x-4',
    md: 'translate-x-5',
    lg: 'translate-x-6',
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'relative inline-flex items-center rounded-full transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:ring-offset-2 focus:ring-offset-bg-primary',
        checked
          ? 'bg-gradient-to-r from-neon-pink to-neon-cyan'
          : 'bg-white/10',
        disabled && 'opacity-50 cursor-not-allowed',
        sizeClasses[size],
        className
      )}
    >
      <span
        className={cn(
          'inline-block bg-white rounded-full shadow-lg transition-transform duration-300',
          checked ? dotTranslateClasses[size] : 'translate-x-0.5',
          dotSizeClasses[size]
        )}
      />
    </button>
  );
};
