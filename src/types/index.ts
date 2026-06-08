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

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  displayName: string;
  bio: string;
  createdAt: string;
}

export type Theme = 'dark' | 'light' | 'auto';
export type Language = 'zh-CN' | 'en-US' | 'ja-JP';
export type AudioQuality = 'low' | 'standard' | 'high' | 'lossless';

export interface SystemPreferences {
  theme: Theme;
  language: Language;
  audioQuality: AudioQuality;
  autoPlay: boolean;
  crossfade: boolean;
  crossfadeDuration: number;
  volumeBoost: boolean;
  lyricsDisplay: boolean;
  lyricsFontSize: number;
  showSpectrum: boolean;
  autoUpdate: boolean;
  minimizeToTray: boolean;
  hardwareAcceleration: boolean;
}

export type NotificationType = 'song' | 'playlist' | 'artist' | 'system' | 'marketing';

export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  desktopNotifications: boolean;
  types: Record<NotificationType, boolean>;
  doNotDisturb: boolean;
  doNotDisturbStart: string;
  doNotDisturbEnd: string;
  emailNotifications: boolean;
  weeklyDigest: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'followers' | 'private';
  showListeningHistory: boolean;
  showFavorites: boolean;
  showPlaylists: boolean;
  allowDataCollection: boolean;
  personalizedRecommendations: boolean;
  showOnlineStatus: boolean;
  allowMessages: 'everyone' | 'followers' | 'no_one';
  explicitContent: boolean;
  blockExplicit: boolean;
}

export interface SettingsState {
  account: UserAccount;
  preferences: SystemPreferences;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  isLoading: boolean;
  error: string | null;
  lastSaved: number | null;
}

export interface SettingsActions {
  setAccount: (account: Partial<UserAccount>) => void;
  setPreferences: (preferences: Partial<SystemPreferences>) => void;
  setNotifications: (notifications: Partial<NotificationSettings>) => void;
  setPrivacy: (privacy: Partial<PrivacySettings>) => void;
  updateNotificationType: (type: NotificationType, enabled: boolean) => void;
  resetToDefaults: () => void;
  saveSettings: () => Promise<boolean>;
  clearError: () => void;
  validatePassword: (password: string) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  logout: () => void;
  deleteAccount: () => Promise<boolean>;
}

export interface SettingsStore extends SettingsState, SettingsActions {}

export type SettingsSection = 'account' | 'preferences' | 'notifications' | 'privacy';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration: number;
}

export interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}
