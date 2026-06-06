import { create } from 'zustand';
import { FavoritesState } from '@/types';
import { getLocalStorage, setLocalStorage } from '@/hooks/useLocalStorage';

interface FavoritesStore extends FavoritesState {}

const initialFavoriteIds = getLocalStorage<string[]>('favorites', []);

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favoriteIds: initialFavoriteIds,

  toggleFavorite: (songId: string) => {
    set((state) => {
      const newFavorites = state.favoriteIds.includes(songId)
        ? state.favoriteIds.filter((id) => id !== songId)
        : [...state.favoriteIds, songId];
      setLocalStorage('favorites', newFavorites);
      return { favoriteIds: newFavorites };
    });
  },

  isFavorite: (songId: string) => {
    return get().favoriteIds.includes(songId);
  },
}));
