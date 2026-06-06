import { PlayMode, Song } from '@/types';

export const getNextIndex = (
  currentIndex: number,
  playlist: Song[],
  playMode: PlayMode,
  direction: 'next' | 'prev'
): number => {
  const length = playlist.length;
  if (length === 0) return 0;

  switch (playMode) {
    case 'shuffle': {
      if (length <= 1) return 0;
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * length);
      } while (newIndex === currentIndex);
      return newIndex;
    }
    case 'loop': {
      return direction === 'next'
        ? (currentIndex + 1) % length
        : (currentIndex - 1 + length) % length;
    }
    case 'single':
    default: {
      return direction === 'next'
        ? (currentIndex + 1) % length
        : (currentIndex - 1 + length) % length;
    }
  }
};

export const getPlayModeIcon = (playMode: PlayMode): string => {
  switch (playMode) {
    case 'loop':
      return 'repeat';
    case 'single':
      return 'repeat-1';
    case 'shuffle':
      return 'shuffle';
    default:
      return 'repeat';
  }
};

export const getPlayModeText = (playMode: PlayMode): string => {
  switch (playMode) {
    case 'loop':
      return '列表循环';
    case 'single':
      return '单曲循环';
    case 'shuffle':
      return '随机播放';
    default:
      return '列表循环';
  }
};

export const cyclePlayMode = (current: PlayMode): PlayMode => {
  const modes: PlayMode[] = ['loop', 'single', 'shuffle'];
  const currentIndex = modes.indexOf(current);
  return modes[(currentIndex + 1) % modes.length];
};
