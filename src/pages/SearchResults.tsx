import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Music, Users, Disc } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SongCard } from '@/components/cards/SongCard';
import { ArtistCard } from '@/components/cards/ArtistCard';
import { PlaylistCard } from '@/components/cards/PlaylistCard';
import { useSearchStore, searchSongs, searchArtists, searchPlaylists } from '@/store/useSearchStore';
import { SearchTab } from '@/types';
import { cn } from '@/utils/cn';

const tabs: { key: SearchTab; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: '综合', icon: Search },
  { key: 'songs', label: '歌曲', icon: Music },
  { key: 'artists', label: '歌手', icon: Users },
  { key: 'playlists', label: '歌单', icon: Disc },
];

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { activeTab, setActiveTab, setKeyword, addHistory } = useSearchStore();

  useEffect(() => {
    if (query) {
      setKeyword(query);
      addHistory(query);
    }
  }, [query, setKeyword, addHistory]);

  const songs = useMemo(() => searchSongs(query), [query]);
  const artists = useMemo(() => searchArtists(query), [query]);
  const playlists = useMemo(() => searchPlaylists(query), [query]);

  const totalResults = songs.length + artists.length + playlists.length;

  const renderContent = () => {
    if (totalResults === 0) {
      return (
        <div className="text-center py-20">
          <Search className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 text-lg">未找到与 "{query}" 相关的内容</p>
          <p className="text-white/30 text-sm mt-2">试试其他关键词吧</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'all':
        return (
          <div className="space-y-8">
            {songs.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5 text-neon-pink" />
                  歌曲 ({songs.length})
                </h3>
                <div className="glass-card rounded-2xl p-4">
                  <div className="grid gap-2">
                    {songs.slice(0, 5).map((song, index) => (
                      <SongCard key={song.id} song={song} index={index + 1} showIndex />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {artists.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-neon-cyan" />
                  歌手 ({artists.length})
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                  {artists.slice(0, 6).map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </div>
            )}

            {playlists.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Disc className="w-5 h-5 text-neon-purple" />
                  歌单 ({playlists.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {playlists.slice(0, 5).map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'songs':
        return songs.length > 0 ? (
          <div className="glass-card rounded-2xl p-6">
            <div className="grid gap-2">
              {songs.map((song, index) => (
                <SongCard key={song.id} song={song} index={index + 1} showIndex />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Music className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">未找到相关歌曲</p>
          </div>
        );

      case 'artists':
        return artists.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">未找到相关歌手</p>
          </div>
        );

      case 'playlists':
        return playlists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Disc className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">未找到相关歌单</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <PageHeader title="搜索结果" showBackButton />

      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-6 h-6 text-neon-pink" />
              <h2 className="text-2xl font-display font-bold gradient-text">
                搜索结果
              </h2>
            </div>
            <p className="text-white/50">
              找到与 <span className="text-neon-pink">"{query}"</span> 相关的 {totalResults} 个结果
            </p>
          </div>

          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              let count = 0;
              if (tab.key === 'songs') count = songs.length;
              else if (tab.key === 'artists') count = artists.length;
              else if (tab.key === 'playlists') count = playlists.length;
              else count = totalResults;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-r from-neon-pink/20 to-neon-cyan/20 text-white border border-neon-pink/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      isActive ? 'bg-neon-pink/20 text-neon-pink' : 'bg-white/10 text-white/40'
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {renderContent()}
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
