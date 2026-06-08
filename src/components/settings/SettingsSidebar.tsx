import React from 'react';
import { User, Settings as SettingsIcon, Bell, Shield } from 'lucide-react';
import { SettingsSection } from '@/types';
import { cn } from '@/utils/cn';

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const sections: { id: SettingsSection; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'account',
    label: '账户设置',
    icon: <User className="w-5 h-5" />,
    description: '个人资料、密码管理',
  },
  {
    id: 'preferences',
    label: '系统偏好',
    icon: <SettingsIcon className="w-5 h-5" />,
    description: '主题、播放、性能设置',
  },
  {
    id: 'notifications',
    label: '通知设置',
    icon: <Bell className="w-5 h-5" />,
    description: '通知方式、勿扰模式',
  },
  {
    id: 'privacy',
    label: '隐私设置',
    icon: <Shield className="w-5 h-5" />,
    description: '数据安全、内容过滤',
  },
];

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  return (
    <div className="w-full lg:w-64 shrink-0">
      <div className="lg:sticky lg:top-4 space-y-2">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 text-left',
                'group',
                isActive
                  ? 'bg-gradient-to-r from-neon-pink/20 to-neon-cyan/20 border border-neon-pink/30'
                  : 'hover:bg-white/5 border border-transparent'
              )}
            >
              <div
                className={cn(
                  'p-2 rounded-lg transition-colors duration-300',
                  isActive
                    ? 'bg-gradient-to-br from-neon-pink/30 to-neon-cyan/30 text-white'
                    : 'bg-white/5 text-white/60 group-hover:text-white'
                )}
              >
                {section.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={cn(
                    'font-medium transition-colors duration-300',
                    isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                  )}
                >
                  {section.label}
                </h4>
                <p className="text-xs text-white/40 mt-0.5 truncate">
                  {section.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
