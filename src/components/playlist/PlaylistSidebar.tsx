import React, { useState } from 'react';
import { ListMusic, Heart, ChevronDown, ChevronUp, Music } from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { usePlaylistStore } from '@/store/usePlaylistStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { SongItem } from './SongItem';
import { mockSongs } from '@/data/songs';

export const PlaylistSidebar: React.FC = () => {
  const { currentSong, isPlaying, playSong } = usePlayerStore();
  const { currentView, setCurrentView } = usePlaylistStore();
  const { favoriteIds } = useFavoritesStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const favoriteSongs = mockSongs.filter((song) =>
    favoriteIds.includes(song.id)
  );
  const displaySongs = currentView === 'all' ? mockSongs : favoriteSongs;

  const handlePlaySong = (song: typeof mockSongs[0], index: number) => {
    const actualIndex = mockSongs.findIndex((s) => s.id === song.id);
    playSong(song, actualIndex);
  };

  return (
    <div
      className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-full md:w-80'
      }`}
    >
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-neon-pink to-neon-cyan">
              <Music className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h3 className="font-display font-bold text-lg gradient-text">
                  我的歌单
                </h3>
                <p className="text-xs text-white/50">
                  {displaySongs.length} 首歌曲
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('all')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                currentView === 'all'
                  ? 'bg-gradient-to-r from-neon-pink to-neon-cyan text-white shadow-lg'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <ListMusic className="w-4 h-4" />
              全部
            </button>
            <button
              onClick={() => setCurrentView('favorites')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                currentView === 'favorites'
                  ? 'bg-gradient-to-r from-neon-pink to-neon-cyan text-white shadow-lg'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Heart className="w-4 h-4" />
              收藏
            </button>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div className="h-[calc(100vh-320px)] overflow-y-auto p-3 space-y-2">
          {displaySongs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/40">
              <Heart className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">暂无收藏歌曲</p>
              <p className="text-xs mt-1">点击歌曲旁的爱心添加收藏</p>
            </div>
          ) : (
            displaySongs.map((song, index) => (
              <SongItem
                key={song.id}
                song={song}
                index={index}
                isPlaying={currentSong?.id === song.id && isPlaying}
                onPlay={() => handlePlaySong(song, index)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
