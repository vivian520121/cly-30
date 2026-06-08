import { create } from 'zustand';
import {
  SettingsStore,
  UserAccount,
  SystemPreferences,
  NotificationSettings,
  PrivacySettings,
  NotificationType,
} from '@/types';
import { getLocalStorage, setLocalStorage } from '@/hooks/useLocalStorage';
import { showToast } from './useToastStore';

const STORAGE_KEYS = {
  ACCOUNT: 'settings_account',
  PREFERENCES: 'settings_preferences',
  NOTIFICATIONS: 'settings_notifications',
  PRIVACY: 'settings_privacy',
};

const defaultAccount: UserAccount = {
  id: 'user_001',
  username: 'musiclover',
  email: 'musiclover@example.com',
  avatarUrl: '',
  displayName: '音乐爱好者',
  bio: '热爱音乐，享受生活',
  createdAt: '2024-01-01T00:00:00Z',
};

const defaultPreferences: SystemPreferences = {
  theme: 'dark',
  language: 'zh-CN',
  audioQuality: 'high',
  autoPlay: true,
  crossfade: false,
  crossfadeDuration: 5,
  volumeBoost: false,
  lyricsDisplay: true,
  lyricsFontSize: 16,
  showSpectrum: true,
  autoUpdate: true,
  minimizeToTray: false,
  hardwareAcceleration: true,
};

const defaultNotifications: NotificationSettings = {
  enabled: true,
  soundEnabled: true,
  desktopNotifications: true,
  types: {
    song: true,
    playlist: true,
    artist: true,
    system: true,
    marketing: false,
  },
  doNotDisturb: false,
  doNotDisturbStart: '22:00',
  doNotDisturbEnd: '08:00',
  emailNotifications: true,
  weeklyDigest: true,
};

const defaultPrivacy: PrivacySettings = {
  profileVisibility: 'public',
  showListeningHistory: true,
  showFavorites: true,
  showPlaylists: true,
  allowDataCollection: true,
  personalizedRecommendations: true,
  showOnlineStatus: true,
  allowMessages: 'followers',
  explicitContent: true,
  blockExplicit: false,
};

const getInitialState = () => ({
  account: getLocalStorage<UserAccount>(STORAGE_KEYS.ACCOUNT, defaultAccount),
  preferences: getLocalStorage<SystemPreferences>(
    STORAGE_KEYS.PREFERENCES, defaultPreferences),
  notifications: getLocalStorage<NotificationSettings>(
    STORAGE_KEYS.NOTIFICATIONS, defaultNotifications),
  privacy: getLocalStorage<PrivacySettings>(
    STORAGE_KEYS.PRIVACY, defaultPrivacy),
  isLoading: false,
  error: null,
  lastSaved: null,
});

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...getInitialState(),

  setAccount: (account) => {
    set((state) => ({
      account: { ...state.account, ...account },
    }));
    setLocalStorage(STORAGE_KEYS.ACCOUNT, { ...get().account, ...account });
  },

  setPreferences: (preferences) => {
    set((state) => ({
      preferences: { ...state.preferences, ...preferences },
    }));
    setLocalStorage(STORAGE_KEYS.PREFERENCES, {
      ...get().preferences, ...preferences });
    if (preferences.theme) {
      const theme = preferences.theme;
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      showToast('success', '主题设置已更新');
    }
    if (preferences.language) {
      showToast('success', '语言设置已更新');
    }
  },

  setNotifications: (notifications) => {
    set((state) => ({
      notifications: { ...state.notifications, ...notifications },
    }));
    setLocalStorage(STORAGE_KEYS.NOTIFICATIONS, {
      ...get().notifications, ...notifications });
  },

  setPrivacy: (privacy) => {
    set((state) => ({
      privacy: { ...state.privacy, ...privacy },
    }));
    setLocalStorage(STORAGE_KEYS.PRIVACY, { ...get().privacy, ...privacy });
  },

  updateNotificationType: (type: NotificationType, enabled: boolean) => {
    set((state) => ({
      notifications: {
        ...state.notifications,
        types: {
          ...state.notifications.types,
          [type]: enabled,
        },
      },
    }));
    setLocalStorage(STORAGE_KEYS.NOTIFICATIONS, get().notifications);
  },

  resetToDefaults: () => {
    set({
      account: defaultAccount,
      preferences: defaultPreferences,
      notifications: defaultNotifications,
      privacy: defaultPrivacy,
    });
    setLocalStorage(STORAGE_KEYS.ACCOUNT, defaultAccount);
    setLocalStorage(STORAGE_KEYS.PREFERENCES, defaultPreferences);
    setLocalStorage(STORAGE_KEYS.NOTIFICATIONS, defaultNotifications);
    setLocalStorage(STORAGE_KEYS.PRIVACY, defaultPrivacy);
    showToast('success', '已恢复默认设置');
  },

  saveSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLocalStorage(STORAGE_KEYS.ACCOUNT, get().account);
      setLocalStorage(STORAGE_KEYS.PREFERENCES, get().preferences);
      setLocalStorage(STORAGE_KEYS.NOTIFICATIONS, get().notifications);
      setLocalStorage(STORAGE_KEYS.PRIVACY, get().privacy);
      set({ isLoading: false, lastSaved: Date.now() });
      showToast('success', '设置已保存');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '保存失败';
      set({ isLoading: false, error: errorMessage });
      showToast('error', errorMessage);
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  validatePassword: async (password: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (password.length >= 6) {
        return true;
      }
      showToast('error', '密码长度至少6位');
      return false;
    } catch {
      showToast('error', '验证失败');
      return false;
    }
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (oldPassword.length < 6) {
        throw new Error('原密码不正确');
      }
      if (newPassword.length < 6) {
        throw new Error('新密码长度至少6位');
      }
      if (oldPassword === newPassword) {
        throw new Error('新密码不能与原密码相同');
      }
      set({ isLoading: false });
      showToast('success', '密码修改成功');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '密码修改失败';
      set({ isLoading: false, error: errorMessage });
      showToast('error', errorMessage);
      return false;
    }
  },

  logout: () => {
    showToast('info', '已退出登录');
  },

  deleteAccount: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      set({ ...getInitialState(), isLoading: false });
      showToast('success', '账户已删除');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '账户删除失败';
      set({ isLoading: false, error: errorMessage });
      showToast('error', errorMessage);
      return false;
    }
  },
}));

export const useSettings = () => useSettingsStore();
