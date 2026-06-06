import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Music, Play, Shuffle, User, Disc } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SongCard } from '@/components/cards/SongCard';
import { mockArtists } from '@/data/artists';
import { mockSongs } from '@/data/songs';
import { usePlayerStore } from '@/store/usePlayerStore';

export const ArtistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playSong, setPlaylist } = usePlayerStore();

  const artist = mockArtists.find((a) => a.id === id);
  const artistSongs = artist
    ? mockSongs.filter((song) => artist.songIds.includes(song.id))
    : [];

  if (!artist) {
    return (
      <div className="min-h-screen pb-32 flex items-center justify-center">
        <div className="text-center">
          <Disc className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">歌手不存在</p>
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

  const formatNumber = (num: number): string => {
    if (num >= 100000000) {
      return (num / 100000000).toFixed(1) + '亿';
    }
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  const handlePlayAll = () => {
    setPlaylist(artistSongs);
    if (artistSongs.length > 0) {
      playSong(artistSongs[0], 0);
    }
  };

  const handleShufflePlay = () => {
    const shuffled = [...artistSongs].sort(() => Math.random() - 0.5);
    setPlaylist(shuffled);
    if (shuffled.length > 0) {
      playSong(shuffled[0], 0);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <PageHeader title={artist.name} showBackButton />

      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-pink/30 to-neon-cyan/30 blur-2xl" />
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white/10">
                  <img
                    src={artist.avatarUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <User className="w-5 h-5 text-neon-pink" />
                  <h1 className="text-4xl font-display font-bold gradient-text">
                    {artist.name}
                  </h1>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <div className="flex items-center gap-1 text-white/60">
                    <Music className="w-4 h-4" />
                    <span className="text-sm">{artist.genre}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/60">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{formatNumber(artist.followers)} 粉丝</span>
                  </div>
                </div>
                <p className="text-white/50 text-sm leading-relaxed max-w-2xl">
                  {artist.description}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-6">
                  <button
                    onClick={handleShufflePlay}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all btn-hover"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span className="text-sm">随机播放</span>
                  </button>
                  <button
                    onClick={handlePlayAll}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-neon-pink to-neon-cyan text-white font-medium btn-hover"
                  >
                    <Play className="w-4 h-4" />
                    <span className="text-sm">播放全部</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
              <Music className="w-5 h-5 text-neon-pink" />
              热门歌曲
            </h2>
          </div>

          <div className="glass-card rounded-2xl p-6">
            {artistSongs.length > 0 ? (
              <div className="grid gap-2">
                {artistSongs.map((song, index) => (
                  <div key={song.id} className="animate-fade-in">
                    <SongCard song={song} index={index + 1} showIndex />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Music className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/40">暂无歌曲</p>
              </div>
            )}
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
