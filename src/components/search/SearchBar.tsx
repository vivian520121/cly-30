import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore, hotSearchKeywords } from '@/store/useSearchStore';

export const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const { keyword, setKeyword, history, addHistory, removeHistory, clearHistory } = useSearchStore();
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchKeyword: string = keyword) => {
    const trimmedKeyword = searchKeyword.trim();
    if (trimmedKeyword) {
      addHistory(trimmedKeyword);
      setIsFocused(false);
      navigate(`/search?q=${encodeURIComponent(trimmedKeyword)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleHotSearchClick = (hotKeyword: string) => {
    setKeyword(hotKeyword);
    handleSearch(hotKeyword);
  };

  const handleHistoryClick = (historyKeyword: string) => {
    setKeyword(historyKeyword);
    handleSearch(historyKeyword);
  };

  const handleClearInput = () => {
    setKeyword('');
    inputRef.current?.focus();
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          ref={inputRef}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder="搜索歌曲、歌手、歌单"
          className="w-full pl-12 pr-24 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-neon-pink/50 focus:bg-white/10 transition-all duration-300"
        />
        {keyword && (
          <button
            onClick={handleClearInput}
            className="absolute right-20 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/40" />
          </button>
        )}
        <button
          onClick={() => handleSearch()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-neon-pink to-neon-cyan rounded-full text-white text-sm font-medium hover:opacity-90 transition-opacity btn-hover"
        >
          搜索
        </button>
      </div>

      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-2xl overflow-hidden z-50 animate-fade-in">
          {history.length > 0 && (
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>搜索历史</span>
                </div>
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-white/40 text-xs hover:text-white/60 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>清空</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <span
                      onClick={() => handleHistoryClick(item.keyword)}
                      className="text-sm text-white/70"
                    >
                      {item.keyword}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHistory(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white/40" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
              <TrendingUp className="w-4 h-4 text-neon-pink" />
              <span>热门搜索</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {hotSearchKeywords.slice(0, 6).map((hotKeyword, index) => (
                <div
                  key={hotKeyword}
                  onClick={() => handleHotSearchClick(hotKeyword)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <span
                    className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${
                      index < 3
                        ? 'bg-gradient-to-r from-neon-pink to-neon-cyan text-white'
                        : 'bg-white/10 text-white/40'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors flex-1 truncate">
                    {hotKeyword}
                  </span>
                  <span className="text-xs text-white/30">
                    {formatNumber(Math.floor(Math.random() * 5000000) + 100000)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
