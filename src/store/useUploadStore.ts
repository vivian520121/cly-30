import { create } from 'zustand';
import { UploadState, UploadedPlaylist } from '@/types';
import { getLocalStorage, setLocalStorage } from '@/hooks/useLocalStorage';

const STORAGE_KEY = 'uploaded_playlists';

const getInitialUploadedPlaylists = (): UploadedPlaylist[] => {
  try {
    return getLocalStorage<UploadedPlaylist[]>(STORAGE_KEY, []);
  } catch {
    return [];
  }
};

export const useUploadStore = create<UploadState>((set, get) => ({
  status: 'idle',
  progress: 0,
  error: null,
  selectedFile: null,
  parsedPlaylist: null,
  uploadedPlaylists: getInitialUploadedPlaylists(),

  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error }),
  setSelectedFile: (file) => set({ selectedFile: file }),
  setParsedPlaylist: (playlist) => set({ parsedPlaylist: playlist }),

  addUploadedPlaylist: (playlist) => {
    const current = get().uploadedPlaylists;
    const updated = [playlist, ...current];
    set({ uploadedPlaylists: updated });
    setLocalStorage(STORAGE_KEY, updated);
  },

  removeUploadedPlaylist: (id) => {
    const current = get().uploadedPlaylists;
    const updated = current.filter((p) => p.id !== id);
    set({ uploadedPlaylists: updated });
    setLocalStorage(STORAGE_KEY, updated);
  },

  resetUpload: () => {
    set({
      status: 'idle',
      progress: 0,
      error: null,
      selectedFile: null,
      parsedPlaylist: null,
    });
  },
}));
