import { LyricLine } from '@/types';

export const parseLRC = (lrcText: string): LyricLine[] => {
  const lines = lrcText.split('\n');
  const lyrics: LyricLine[] = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;

  for (const line of lines) {
    const matches = [...line.matchAll(timeRegex)];
    const text = line.replace(timeRegex, '').trim();

    if (text && matches.length > 0) {
      for (const match of matches) {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const milliseconds = parseInt(match[3].padEnd(3, '0'));
        const time = minutes * 60 + seconds + milliseconds / 1000;
        lyrics.push({ time, text });
      }
    }
  }

  return lyrics.sort((a, b) => a.time - b.time);
};

export const findCurrentLyricIndex = (
  lyrics: LyricLine[],
  currentTime: number
): number => {
  if (!lyrics || lyrics.length === 0) return -1;

  let left = 0;
  let right = lyrics.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (lyrics[mid].time <= currentTime) {
      result = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
};

export const findNearestLyricIndex = (
  lyrics: LyricLine[],
  targetTime: number
): number => {
  if (!lyrics || lyrics.length === 0) return 0;
  
  let closest = 0;
  let minDiff = Math.abs(lyrics[0].time - targetTime);

  for (let i = 1; i < lyrics.length; i++) {
    const diff = Math.abs(lyrics[i].time - targetTime);
    if (diff < minDiff) {
      minDiff = diff;
      closest = i;
    }
  }

  return closest;
};
