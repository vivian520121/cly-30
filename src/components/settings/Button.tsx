import React from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-gradient-to-r from-neon-pink to-neon-cyan text-white hover:shadow-lg hover:shadow-neon-pink/30',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
    danger: 'bg-neon-pink/20 text-neon-pink border border-neon-pink/30 hover:bg-neon-pink/30',
    ghost: 'text-white/70 hover:text-white hover:bg-white/10',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
        'transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:ring-offset-2 focus:ring-offset-bg-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};
