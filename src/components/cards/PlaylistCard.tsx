import React from 'react';
import { Play, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Playlist } from '@/types';

interface PlaylistCardProps {
  playlist: Playlist;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const navigate = useNavigate();

  const formatPlayCount = (count: number): string => {
    if (count >= 100000000) {
      return (count / 100000000).toFixed(1) + '亿';
    }
    if (count >= 10000) {
      return (count / 10000).toFixed(1) + '万';
    }
    return count.toString();
  };

  const handleClick = () => {
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
        <img
          src={playlist.coverUrl}
          alt={playlist.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
          <Headphones className="w-3 h-3 text-white/80" />
          <span className="text-xs text-white/80">{formatPlayCount(playlist.playCount)}</span>
        </div>
        <div className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-neon-pink flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-neon-pink/30">
          <Play className="w-5 h-5 text-white ml-0.5" />
        </div>
      </div>
      <h4 className="text-white font-medium truncate group-hover:text-neon-pink transition-colors">
        {playlist.name}
      </h4>
      <p className="text-sm text-white/50 truncate mt-1">{playlist.description}</p>
    </div>
  );
};
