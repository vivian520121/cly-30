import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music2, Flame, Sparkles, Newspaper, ChevronRight, Upload } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Navigation } from '@/components/layout/Navigation';
import { PlaylistSidebar } from '@/components/playlist/PlaylistSidebar';
import { LyricsDisplay } from '@/components/lyrics/LyricsDisplay';
import { AlbumCover } from '@/components/common/AlbumCover';
import { AudioSpectrum } from '@/components/visualizer/AudioSpectrum';
import { PlaylistCard } from '@/components/cards/PlaylistCard';
import { SongCard } from '@/components/cards/SongCard';
import { ArtistCard } from '@/components/cards/ArtistCard';
import { usePlayerStore } from '@/store/usePlayerStore';
import { hotPlaylists } from '@/data/playlists';
import { useAllPlaylists } from '@/hooks/useAllPlaylists';
import { recommendSongs, newSongs } from '@/data/songs';
import { mockArtists } from '@/data/artists';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentSong, isPlaying, frequencyData } = usePlayerStore();
  const { uploadedPlaylists } = useAllPlaylists();

  const quickLinks = [
    { path: '/hot', label: '热门歌单', icon: Flame, color: 'from-neon-pink to-neon-purple' },
    { path: '/recommend', label: '推荐歌曲', icon: Sparkles, color: 'from-neon-cyan to-neon-purple' },
    { path: '/new', label: '新歌首发', icon: Newspaper, color: 'from-neon-purple to-neon-pink' },
    { path: '/upload', label: '上传歌单', icon: Upload, color: 'from-neon-cyan to-neon-pink' },
  ];

  return (
    <div className="min-h-screen pb-32">
      <PageHeader title="首页" />

      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Navigation />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="w-full lg:w-80 flex-shrink-0">
              <PlaylistSidebar />
            </aside>

            <section className="flex-1 flex flex-col gap-8">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.path}
                      onClick={() => navigate(link.path)}
                      className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:scale-105 transition-all duration-300 group"
                    >
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${link.color}`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-white font-bold text-lg">{link.label}</h3>
                        <p className="text-white/50 text-sm">点击查看更多</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>
                  );
                })}
              </div>

              {uploadedPlaylists.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-neon-cyan" />
                      <h2 className="text-xl font-display font-bold text-white">我的歌单</h2>
                    </div>
                    <button
                      onClick={() => navigate('/upload')}
                      className="flex items-center gap-1 text-white/50 hover:text-neon-cyan transition-colors text-sm"
                    >
                      管理 <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {uploadedPlaylists.slice(0, 5).map((playlist) => (
                      <PlaylistCard key={playlist.id} playlist={playlist} />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-neon-pink" />
                    <h2 className="text-xl font-display font-bold text-white">热门歌单</h2>
                  </div>
                  <button
                    onClick={() => navigate('/hot')}
                    className="flex items-center gap-1 text-white/50 hover:text-neon-pink transition-colors text-sm"
                  >
                    查看更多 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {hotPlaylists.slice(0, 5).map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-neon-cyan" />
                    <h2 className="text-xl font-display font-bold text-white">推荐歌曲</h2>
                  </div>
                  <button
                    onClick={() => navigate('/recommend')}
                    className="flex items-center gap-1 text-white/50 hover:text-neon-cyan transition-colors text-sm"
                  >
                    查看更多 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="glass-card rounded-2xl p-4">
                  <div className="grid gap-2">
                    {recommendSongs.slice(0, 5).map((song, index) => (
                      <SongCard key={song.id} song={song} index={index + 1} showIndex />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-neon-purple" />
                    <h2 className="text-xl font-display font-bold text-white">热门歌手</h2>
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {mockArtists.slice(0, 8).map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Music2 className="w-5 h-5 text-neon-pink" />
                    <h2 className="text-xl font-display font-bold text-white">新歌首发</h2>
                  </div>
                  <button
                    onClick={() => navigate('/new')}
                    className="flex items-center gap-1 text-white/50 hover:text-neon-pink transition-colors text-sm"
                  >
                    查看更多 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="glass-card rounded-2xl p-4">
                  <div className="grid gap-2">
                    {newSongs.slice(0, 5).map((song, index) => (
                      <SongCard key={song.id} song={song} index={index + 1} showIndex />
                    ))}
                  </div>
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
