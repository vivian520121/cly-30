import React from 'react';
import { Newspaper, Play, Shuffle, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SongCard } from '@/components/cards/SongCard';
import { newSongs } from '@/data/songs';
import { usePlayerStore } from '@/store/usePlayerStore';

export const NewSongs: React.FC = () => {
  const { playSong, setPlaylist } = usePlayerStore();

  const handlePlayAll = () => {
    setPlaylist(newSongs);
    if (newSongs.length > 0) {
      playSong(newSongs[0], 0);
    }
  };

  const handleShufflePlay = () => {
    const shuffled = [...newSongs].sort(() => Math.random() - 0.5);
    setPlaylist(shuffled);
    if (shuffled.length > 0) {
      playSong(shuffled[0], 0);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <PageHeader title="新歌首发" />

      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-neon-pink to-neon-cyan neon-glow-pink">
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold gradient-text">
                    新歌首发
                  </h2>
                  <p className="text-sm text-white/50">最新鲜的音乐，第一时间为你呈现</p>
                </div>
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
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-neon-pink to-neon-cyan text-white font-medium btn-hover"
                >
                  <Play className="w-4 h-4" />
                  <span className="text-sm">播放全部</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-neon-pink" />
              <span className="text-white/70 font-medium">新歌榜</span>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="grid gap-2">
                {newSongs.map((song, index) => (
                  <div key={song.id} className="animate-fade-in">
                    <SongCard song={song} index={index + 1} showIndex />
                  </div>
                ))}
              </div>
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
