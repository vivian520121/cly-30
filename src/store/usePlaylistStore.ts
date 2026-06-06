import { create } from 'zustand';
import { PlaylistState } from '@/types';
import { getLocalStorage, setLocalStorage } from '@/hooks/useLocalStorage';

interface PlaylistStore extends PlaylistState {}

const initialView = getLocalStorage<'all' | 'favorites'>('playlist_view', 'all');

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  currentView: initialView,

  setCurrentView: (view: 'all' | 'favorites') => {
    set({ currentView: view });
    setLocalStorage('playlist_view', view);
  },
}));
