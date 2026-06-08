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
  totalDuration?: number;
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

export type PlaylistFormat = 'm3u' | 'pls' | 'xspf';

export interface ParsedPlaylistTrack {
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  filePath?: string;
}

export interface ParsedPlaylist {
  name: string;
  format: PlaylistFormat;
  tracks: ParsedPlaylistTrack[];
  totalDuration: number;
}

export type UploadStatus = 'idle' | 'selecting' | 'uploading' | 'parsing' | 'success' | 'error';

export interface UploadedPlaylist extends Playlist {
  format: PlaylistFormat;
  originalFileName: string;
  uploadTime: string;
  parsedTracks: ParsedPlaylistTrack[];
}

export interface UploadState {
  status: UploadStatus;
  progress: number;
  error: string | null;
  selectedFile: File | null;
  parsedPlaylist: ParsedPlaylist | null;
  uploadedPlaylists: UploadedPlaylist[];
  setStatus: (status: UploadStatus) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  setSelectedFile: (file: File | null) => void;
  setParsedPlaylist: (playlist: ParsedPlaylist | null) => void;
  addUploadedPlaylist: (playlist: UploadedPlaylist) => void;
  removeUploadedPlaylist: (id: string) => void;
  resetUpload: () => void;
}
