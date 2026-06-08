import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { createPortal } from 'react-dom';

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

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  dropUp: boolean;
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
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const updateDropdownPosition = () => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const dropdownHeight = Math.min(options.length * 48 + 16, 300);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    const dropUp = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
    
    setDropdownPosition({
      top: dropUp ? rect.top - window.scrollY - dropdownHeight - 8 : rect.bottom - window.scrollY + 8,
      left: rect.left,
      width: rect.width,
      dropUp,
    });
  };

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener('resize', updateDropdownPosition);
      window.addEventListener('scroll', updateDropdownPosition, true);
    }
    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, true);
    };
  }, [isOpen]);

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

  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen) {
        updateDropdownPosition();
      }
      setIsOpen(!isOpen);
    }
  };

  const dropdownContent = isOpen && dropdownPosition ? (
    <div
      style={{
        position: 'fixed',
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 9999,
      }}
      className={cn(
        'py-2',
        'bg-bg-secondary border border-white/10 rounded-xl',
        'shadow-2xl backdrop-blur-xl',
        'animate-fade-in'
      )}
    >
      <div className="max-h-72 overflow-y-auto">
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
    </div>
  ) : null;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
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

      {isOpen && dropdownContent && createPortal(dropdownContent, document.body)}
    </div>
  );
}
