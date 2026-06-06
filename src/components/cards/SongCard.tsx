import React from 'react';
import { Play, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Song } from '@/types';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { formatTime } from '@/utils/formatTime';

interface SongCardProps {
  song: Song;
  index?: number;
  showIndex?: boolean;
}

export const SongCard: React.FC<SongCardProps> = ({ song, index, showIndex = false }) => {
  const navigate = useNavigate();
  const { playSong } = usePlayerStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(song.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSong(song, 0);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(song.id);
  };

  const handleClick = () => {
    navigate(`/song/${song.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer"
    >
      {showIndex && (
        <span className="w-8 text-center text-white/40 font-mono text-sm">{index}</span>
      )}
      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
        <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={handlePlay}
            className="w-8 h-8 rounded-full bg-neon-pink flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform"
          >
            <Play className="w-4 h-4 text-white ml-0.5" />
          </button>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium truncate group-hover:text-neon-pink transition-colors">
          {song.title}
        </h4>
        <p className="text-sm text-white/50 truncate">{song.artist}</p>
      </div>
      <span className="text-white/30 text-sm font-mono hidden sm:block">
        {formatTime(song.duration)}
      </span>
      <button
        onClick={handleToggleFavorite}
        className="p-2 rounded-full hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            favorite ? 'fill-neon-pink text-neon-pink' : 'text-white/40'
          }`}
        />
      </button>
    </div>
  );
};
