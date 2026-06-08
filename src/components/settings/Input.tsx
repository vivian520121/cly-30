import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  showPasswordToggle?: boolean;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  showPasswordToggle = false,
  icon,
  className,
  containerClassName,
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle
    ? showPassword
      ? 'text'
      : 'password'
    : type;

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          className={cn(
            'w-full px-4 py-3',
            'bg-white/5 border border-white/10 rounded-xl',
            'text-white placeholder-white/30',
            'transition-all duration-300',
            'hover:bg-white/10 hover:border-neon-cyan/30',
            'focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            icon && 'pl-10',
            showPasswordToggle && 'pr-10',
            error && 'border-neon-pink/50 focus:ring-neon-pink/50 focus:border-neon-pink/50',
            className
          )}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-neon-pink">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-sm text-white/40">{hint}</p>
      )}
    </div>
  );
};
