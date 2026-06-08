import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SettingsItemProps {
  title: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-6 py-4',
        'border-b border-white/5 last:border-b-0',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-white font-medium">{title}</h4>
          {description && (
            <div className="group relative">
              <Info className="w-4 h-4 text-white/30 hover:text-white/50 cursor-help" />
              <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-bg-secondary border border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                <p className="text-sm text-white/70">{description}</p>
              </div>
            </div>
          )}
        </div>
        {description && (
          <p className="mt-1 text-sm text-white/50">{description}</p>
        )}
      </div>
      <div className="flex items-center shrink-0">{children}</div>
    </div>
  );
};
