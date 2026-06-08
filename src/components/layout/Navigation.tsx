import React from 'react';
import { Flame, Sparkles, Newspaper, Home, Upload } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/hot', label: '热门歌单', icon: Flame },
  { path: '/recommend', label: '推荐歌曲', icon: Sparkles },
  { path: '/new', label: '新歌首发', icon: Newspaper },
  { path: '/upload', label: '上传歌单', icon: Upload },
];

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="flex items-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300',
              isActive
                ? 'bg-gradient-to-r from-neon-pink/20 to-neon-cyan/20 text-white border border-neon-pink/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
