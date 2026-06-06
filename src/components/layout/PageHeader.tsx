import React from 'react';
import { ArrowLeft, Headphones, Music2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SearchBar } from '@/components/search/SearchBar';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  showSearch?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  showBackButton = false,
  showSearch = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-card border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors btn-hover"
            >
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </button>
          )}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-neon-pink to-neon-cyan neon-glow-pink">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-xl gradient-text">
                NEON MUSIC
              </h1>
              <p className="text-xs text-white/50">沉浸式音乐体验</p>
            </div>
          </div>
        </div>

        {showSearch && (
          <div className="flex-1 max-w-xl">
            <SearchBar />
          </div>
        )}

        {!isHome && (
          <div className="hidden md:flex items-center gap-2 text-white/40 text-sm flex-shrink-0">
            <Music2 className="w-4 h-4" />
            <span>{title}</span>
          </div>
        )}
      </div>
    </header>
  );
};
