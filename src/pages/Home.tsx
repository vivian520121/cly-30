import React from 'react';
import { Headphones, Music2 } from 'lucide-react';
import { PlaylistSidebar } from '@/components/playlist/PlaylistSidebar';
import { LyricsDisplay } from '@/components/lyrics/LyricsDisplay';
import { AlbumCover } from '@/components/common/AlbumCover';
import { AudioSpectrum } from '@/components/visualizer/AudioSpectrum';
import { usePlayerStore } from '@/store/usePlayerStore';

export const Home: React.FC = () => {
  const { currentSong, isPlaying, frequencyData } = usePlayerStore();

  return (
    <div className="min-h-screen pb-32">
      <header className="fixed top-0 left-0 right-0 z-40 glass-card border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-neon-pink to-neon-cyan neon-glow-pink">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl gradient-text">
                NEON MUSIC
              </h1>
              <p className="text-xs text-white/50">沉浸式音乐体验</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-white/40 text-sm">
            <Music2 className="w-4 h-4" />
            <span>高品质 · 无损音质</span>
          </div>
        </div>
      </header>

      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="w-full lg:w-80 flex-shrink-0">
              <PlaylistSidebar />
            </aside>

            <section className="flex-1 flex flex-col gap-6">
              <div className="glass-card rounded-2xl p-6 animate-fade-in">
                <AudioSpectrum frequencyData={frequencyData} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center animate-slide-up">
                  {currentSong && (
                    <>
                      <div className="mb-6">
                        <AlbumCover
                          coverUrl={currentSong.coverUrl}
                          title={currentSong.title}
                          isPlaying={isPlaying}
                          size="lg"
                        />
                      </div>
                      <div className="text-center mt-4">
                        <h2 className="text-2xl font-display font-bold gradient-text mb-2">
                          {currentSong.title}
                        </h2>
                        <p className="text-white/70 mb-1">{currentSong.artist}</p>
                        <p className="text-sm text-white/40">
                          专辑 · {currentSong.album}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
                          <span className="text-xs text-white/50 font-display">
                            {isPlaying ? 'PLAYING' : 'PAUSED'}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="glass-card rounded-2xl p-6 h-[500px] overflow-hidden animate-slide-up">
                  <LyricsDisplay />
                </div>
              </div>
            </section>
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
