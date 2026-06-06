import React from 'react';

interface AlbumCoverProps {
  coverUrl: string;
  title: string;
  isPlaying: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-32 h-32',
  lg: 'w-64 h-64',
};

export const AlbumCover: React.FC<AlbumCoverProps> = ({
  coverUrl,
  title,
  isPlaying,
  size = 'lg',
}) => {
  return (
    <div className={`relative ${sizeClasses[size]} group`}>
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br from-neon-pink to-neon-cyan opacity-30 blur-xl ${
          isPlaying ? 'animate-pulse-neon' : ''
        }`}
      />
      <div
        className={`relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white/10 ${
          isPlaying ? 'animate-record' : 'animate-record paused'
        }`}
      >
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-bg-primary border-4 border-white/20 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white/40" />
        </div>
      </div>
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          isPlaying ? 'opacity-100' : ''
        }`}
      />
    </div>
  );
};
