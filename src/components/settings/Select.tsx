import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface SelectProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder = '请选择',
  disabled = false,
  className,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3',
          'bg-white/5 border border-white/10 rounded-xl',
          'text-white transition-all duration-300',
          'hover:bg-white/10 hover:border-neon-cyan/30',
          'focus:outline-none focus:ring-2 focus:ring-neon-cyan/50',
          disabled && 'opacity-50 cursor-not-allowed',
          isOpen && 'border-neon-cyan/50'
        )}
      >
        <span className={cn(!selectedOption && 'text-white/40')}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-white/60 transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 w-full mt-2 py-2',
            'bg-bg-secondary border border-white/10 rounded-xl',
            'shadow-xl backdrop-blur-xl',
            'animate-fade-in'
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                if (!option.disabled) {
                  onChange(option.value);
                  setIsOpen(false);
                }
              }}
              className={cn(
                'w-full flex items-center justify-between px-4 py-2.5',
                'text-left transition-all duration-200',
                'hover:bg-white/5',
                option.value === value && 'bg-neon-cyan/10',
                option.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div>
                <div className="text-white text-sm font-medium">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-white/50 text-xs mt-0.5">
                    {option.description}
                  </div>
                )}
              </div>
              {option.value === value && (
                <Check className="w-4 h-4 text-neon-cyan" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
