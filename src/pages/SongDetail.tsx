import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Heart, Share2, User, Disc } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { AlbumCover } from '@/components/common/AlbumCover';
import { LyricsDisplay } from '@/components/lyrics/LyricsDisplay';
import { mockSongs } from '@/data/songs';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { formatTime } from '@/utils/formatTime';

export const SongDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playSong, isPlaying, currentSong } = usePlayerStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const song = mockSongs.find((s) => s.id === id);

  if (!song) {
    return (
      <div className="min-h-screen pb-32 flex items-center justify-center">
        <div className="text-center">
          <Disc className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">歌曲不存在</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-white/10 rounded-xl text-white/70 hover:bg-white/20 transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(song.id);
  const isCurrentPlaying = currentSong?.id === song.id && isPlaying;

  const handlePlay = () => {
    playSong(song, 0);
  };

  const handleArtistClick = () => {
    const artist = song.artist;
    navigate(`/search?q=${encodeURIComponent(artist)}`);
  };

  return (
    <div className="min-h-screen pb-32">
      <PageHeader title={song.title} showBackButton />

      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card rounded-2xl p-8 animate-fade-in">
              <div className="flex flex-col items-center">
                <div className="mb-8">
                  <AlbumCover
                    coverUrl={song.coverUrl}
                    title={song.title}
                    isPlaying={isCurrentPlaying}
                    size="lg"
                  />
                </div>

                <div className="text-center mb-6">
                  <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                    {song.title}
                  </h1>
                  <p
                    onClick={handleArtistClick}
                    className="text-lg text-white/70 hover:text-neon-pink transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <User className="w-4 h-4" />
                    {song.artist}
                  </p>
                  <p className="text-sm text-white/40 mt-1">专辑 · {song.album}</p>
                  <p className="text-xs text-white/30 mt-1">时长 · {formatTime(song.duration)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePlay}
                    className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-neon-pink to-neon-cyan text-white font-medium btn-hover neon-glow-pink"
                  >
                    <Play className="w-5 h-5 ml-1" />
                    {isCurrentPlaying ? '播放中' : '播放'}
                  </button>
                  <button
                    onClick={() => toggleFavorite(song.id)}
                    className={`p-3 rounded-full border transition-all btn-hover ${
                      favorite
                        ? 'bg-neon-pink/20 border-neon-pink/50 text-neon-pink'
                        : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all btn-hover">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 h-[600px] overflow-hidden animate-fade-in">
              <LyricsDisplay />
            </div>
          </div>
        </div>
      </main>

      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>
    </div>
  );
};
