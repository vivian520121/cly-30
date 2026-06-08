import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Shuffle, Headphones, User, Calendar, Tag, Disc } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SongCard } from '@/components/cards/SongCard';
import { mockSongs } from '@/data/songs';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useAllPlaylists } from '@/hooks/useAllPlaylists';

export const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playSong, setPlaylist } = usePlayerStore();
  const { getPlaylistById } = useAllPlaylists();

  const playlist = id ? getPlaylistById(id) : undefined;
  const playlistSongs = playlist
    ? mockSongs.filter((song) => playlist.songIds.includes(song.id))
    : [];

  if (!playlist) {
    return (
      <div className="min-h-screen pb-32 flex items-center justify-center">
        <div className="text-center">
          <Disc className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">歌单不存在</p>
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
    setPlaylist(playlistSongs);
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0], 0);
    }
  };

  const handleShufflePlay = () => {
    const shuffled = [...playlistSongs].sort(() => Math.random() - 0.5);
    setPlaylist(shuffled);
    if (shuffled.length > 0) {
      playSong(shuffled[0], 0);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <PageHeader title={playlist.name} showBackButton />

      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-pink/30 to-neon-cyan/30 blur-2xl" />
                <div className="relative w-48 h-48 rounded-2xl overflow-hidden">
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-display font-bold gradient-text mb-4">
                  {playlist.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-white/50">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{playlist.creator}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{playlist.createTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Headphones className="w-4 h-4" />
                    <span>{formatNumber(playlist.playCount)} 播放</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    <span>{playlistSongs.length} 首歌曲</span>
                  </div>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  {playlist.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {playlist.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/60 border border-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
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

          <div className="glass-card rounded-2xl p-6">
            {playlistSongs.length > 0 ? (
              <div className="grid gap-2">
                {playlistSongs.map((song, index) => (
                  <div key={song.id} className="animate-fade-in">
                    <SongCard song={song} index={index + 1} showIndex />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Disc className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/40">歌单暂无歌曲</p>
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
