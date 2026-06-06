import React from 'react';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Artist } from '@/types';

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const navigate = useNavigate();

  const formatFollowers = (count: number): string => {
    if (count >= 100000000) {
      return (count / 100000000).toFixed(1) + '亿';
    }
    if (count >= 10000) {
      return (count / 10000).toFixed(1) + '万';
    }
    return count.toString();
  };

  const handleClick = () => {
    navigate(`/artist/${artist.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer text-center"
    >
      <div className="relative w-32 h-32 mx-auto mb-4">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 group-hover:border-neon-pink/50 transition-colors">
          <img
            src={artist.avatarUrl}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <h4 className="text-white font-medium group-hover:text-neon-pink transition-colors">
        {artist.name}
      </h4>
      <div className="flex items-center justify-center gap-1 mt-2">
        <Users className="w-3 h-3 text-white/40" />
        <span className="text-xs text-white/40">{formatFollowers(artist.followers)} 粉丝</span>
      </div>
    </div>
  );
};
