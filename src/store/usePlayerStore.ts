import { create } from 'zustand';
import { Song, PlayMode, PlayerState, PlayerActions } from '@/types';
import { mockSongs } from '@/data/songs';
import { getNextIndex } from '@/utils/playMode';
import { getLocalStorage, setLocalStorage } from '@/hooks/useLocalStorage';

interface PlayerStore extends PlayerState, PlayerActions {
  frequencyData: number[];
  setFrequencyData: (data: number[]) => void;
}

const initialState: PlayerState & { frequencyData: number[] } = {
  currentSong: mockSongs[0] || null,
  isPlaying: false,
  currentTime: 0,
  duration: mockSongs[0]?.duration || 0,
  volume: getLocalStorage('player_volume', 0.7),
  isMuted: getLocalStorage('player_muted', false),
  playMode: getLocalStorage('player_playMode', 'loop') as PlayMode,
  playlist: mockSongs,
  currentIndex: 0,
  frequencyData: new Array(64).fill(0),
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...initialState,

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  next: () => {
    const { currentIndex, playlist, playMode } = get();
    const nextIndex = getNextIndex(currentIndex, playlist, playMode, 'next');
    const nextSong = playlist[nextIndex];
    if (nextSong) {
      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        currentTime: 0,
        duration: nextSong.duration,
      });
    }
  },

  prev: () => {
    const { currentIndex, playlist, playMode, currentTime } = get();
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }
    const prevIndex = getNextIndex(currentIndex, playlist, playMode, 'prev');
    const prevSong = playlist[prevIndex];
    if (prevSong) {
      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        currentTime: 0,
        duration: prevSong.duration,
      });
    }
  },

  seek: (time: number) => set({ currentTime: time }),

  setVolume: (volume: number) => {
    set({ volume, isMuted: volume === 0 });
    setLocalStorage('player_volume', volume);
    if (volume === 0) {
      setLocalStorage('player_muted', true);
    }
  },

  toggleMute: () => {
    set((state) => {
      const newMuted = !state.isMuted;
      setLocalStorage('player_muted', newMuted);
      return { isMuted: newMuted };
    });
  },

  setPlayMode: (mode: PlayMode) => {
    set({ playMode: mode });
    setLocalStorage('player_playMode', mode);
  },

  playSong: (song: Song, index?: number) => {
    const { playlist } = get();
    const songIndex = index ?? playlist.findIndex((s) => s.id === song.id);
    set({
      currentSong: song,
      currentIndex: songIndex >= 0 ? songIndex : 0,
      currentTime: 0,
      duration: song.duration,
      isPlaying: true,
    });
  },

  setCurrentTime: (time: number) => set({ currentTime: time }),

  setDuration: (duration: number) => set({ duration }),

  setFrequencyData: (data: number[]) => set({ frequencyData: data }),

  setPlaylist: (songs: Song[]) => {
    set({ playlist: songs, currentIndex: 0 });
  },
}));
