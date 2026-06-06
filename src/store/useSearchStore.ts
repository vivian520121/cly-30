import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SearchState, SearchTab, Song, Artist, Playlist } from '@/types';
import { mockSongs } from '@/data/songs';
import { mockArtists } from '@/data/artists';
import { mockPlaylists } from '@/data/playlists';

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      keyword: '',
      activeTab: 'all' as SearchTab,
      history: [],
      setKeyword: (keyword: string) => set({ keyword }),
      setActiveTab: (tab: SearchTab) => set({ activeTab: tab }),
      addHistory: (keyword: string) =>
        set((state) => {
          const existingIndex = state.history.findIndex((item) => item.keyword === keyword);
          if (existingIndex !== -1) {
            const newHistory = [...state.history];
            newHistory.splice(existingIndex, 1);
            return {
              history: [
                { id: Date.now().toString(), keyword, timestamp: Date.now() },
                ...newHistory,
              ].slice(0, 10),
            };
          }
          return {
            history: [
              { id: Date.now().toString(), keyword, timestamp: Date.now() },
              ...state.history,
            ].slice(0, 10),
          };
        }),
      removeHistory: (id: string) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'search-history-storage',
      partialize: (state) => ({ history: state.history }),
    }
  )
);

export const hotSearchKeywords = [
  '周杰伦',
  '晴天',
  'Beyond',
  '海阔天空',
  '朴树',
  '平凡之路',
  '林俊杰',
  '邓紫棋',
  '五月天',
  '毛不易',
];

export const searchSongs = (keyword: string): Song[] => {
  const lowerKeyword = keyword.toLowerCase();
  return mockSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(lowerKeyword) ||
      song.artist.toLowerCase().includes(lowerKeyword) ||
      song.album.toLowerCase().includes(lowerKeyword)
  );
};

export const searchArtists = (keyword: string): Artist[] => {
  const lowerKeyword = keyword.toLowerCase();
  return mockArtists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(lowerKeyword) ||
      artist.genre.toLowerCase().includes(lowerKeyword) ||
      artist.description.toLowerCase().includes(lowerKeyword)
  );
};

export const searchPlaylists = (keyword: string): Playlist[] => {
  const lowerKeyword = keyword.toLowerCase();
  return mockPlaylists.filter(
    (playlist) =>
      playlist.name.toLowerCase().includes(lowerKeyword) ||
      playlist.description.toLowerCase().includes(lowerKeyword) ||
      playlist.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
  );
};
