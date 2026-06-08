import React from 'react';
import { cn } from '@/utils/cn';

interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  icon,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10',
        'p-6 mb-6',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 rounded-xl">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
};
