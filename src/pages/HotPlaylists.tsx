import React from 'react';
import { Flame } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PlaylistCard } from '@/components/cards/PlaylistCard';
import { mockPlaylists } from '@/data/playlists';

export const HotPlaylists: React.FC = () => {
  return (
    <div className="min-h-screen pb-32">
      <PageHeader title="热门歌单" />

      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-neon-pink to-neon-cyan neon-glow-pink">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold gradient-text">
                  热门歌单
                </h2>
                <p className="text-sm text-white/50">精选全网最火的歌单，发现更多好音乐</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {mockPlaylists.map((playlist) => (
              <div key={playlist.id} className="animate-fade-in">
                <PlaylistCard playlist={playlist} />
              </div>
            ))}
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
