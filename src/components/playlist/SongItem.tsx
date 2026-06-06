import React from 'react';
import { Play, Pause, Heart, MoreHorizontal, Music2 } from 'lucide-react';
import { Song } from '@/types';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { formatTime } from '@/utils/formatTime';

interface SongItemProps {
  song: Song;
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
}

export const SongItem: React.FC<SongItemProps> = ({
  song,
  index,
  isPlaying,
  onPlay,
}) => {
  const { togglePlay } = usePlayerStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [showActions, setShowActions] = React.useState(false);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      togglePlay();
    } else {
      onPlay();
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(song.id);
  };

  return (
    <div
      className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden ${
        isPlaying
          ? 'bg-gradient-to-r from-neon-pink/20 to-neon-cyan/20 border border-neon-pink/30'
          : 'hover:bg-white/5'
      }`}
      onClick={onPlay}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isPlaying && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-pink to-neon-cyan rounded-r-full" />
      )}

      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div
          className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
            showActions || isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-neon-pink rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium truncate ${
              isPlaying ? 'text-neon-pink' : 'text-white'
            }`}
          >
            {song.title}
          </span>
          {isPlaying && (
            <Music2 className="w-4 h-4 text-neon-pink animate-bounce" />
          )}
        </div>
        <p className="text-xs text-white/50 truncate">{song.artist}</p>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-xs text-white/40 mr-2">
          {formatTime(song.duration)}
        </span>

        <button
          onClick={handlePlayClick}
          className={`p-2 rounded-full transition-all duration-200 ${
            showActions ? 'opacity-100' : 'opacity-0'
          } ${
            isPlaying
              ? 'text-neon-cyan bg-neon-cyan/10'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title={isPlaying ? '暂停' : '播放'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={handleFavoriteClick}
          className={`p-2 rounded-full transition-all duration-200 ${
            isFavorite(song.id)
              ? 'text-neon-pink opacity-100'
              : showActions
              ? 'opacity-100 text-white/60 hover:text-neon-pink'
              : 'opacity-0'
          }`}
          title={isFavorite(song.id) ? '取消收藏' : '收藏'}
        >
          <Heart
            className="w-4 h-4"
            fill={isFavorite(song.id) ? 'currentColor' : 'none'}
          />
        </button>

        <button
          className={`p-2 rounded-full transition-all duration-200 text-white/60 hover:text-white hover:bg-white/10 ${
            showActions ? 'opacity-100' : 'opacity-0'
          }`}
          title="更多"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
