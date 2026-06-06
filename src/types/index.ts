export interface LyricLine {
  time: number;
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
  lyrics: LyricLine[];
}

export type PlayMode = 'loop' | 'single' | 'shuffle';

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playMode: PlayMode;
  playlist: Song[];
  currentIndex: number;
}

export interface PlayerActions {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlayMode: (mode: PlayMode) => void;
  playSong: (song: Song, index?: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaylist: (songs: Song[]) => void;
}

export interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
}

export interface PlaylistState {
  currentView: 'all' | 'favorites';
  setCurrentView: (view: 'all' | 'favorites') => void;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  description: string;
  genre: string;
  followers: number;
  songIds: string[];
}

export interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  description: string;
  playCount: number;
  songIds: string[];
  creator: string;
  createTime: string;
  tags: string[];
}

export interface SearchHistoryItem {
  id: string;
  keyword: string;
  timestamp: number;
}

export type SearchTab = 'all' | 'songs' | 'artists' | 'playlists';

export interface SearchState {
  keyword: string;
  activeTab: SearchTab;
  history: SearchHistoryItem[];
  setKeyword: (keyword: string) => void;
  setActiveTab: (tab: SearchTab) => void;
  addHistory: (keyword: string) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
}

export type PageType = 'hot' | 'recommend' | 'new';
